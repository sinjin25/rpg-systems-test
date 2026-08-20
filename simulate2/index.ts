import { Actor2, instantiateActor, OwnerMaximal } from "../actor2"
import { act, actionIsAbility, applyResolutions, outputFinalSar } from "../actor2/act"
import { resolveAbility } from "../ability-sheet2"
import { instantiateSpeed, reinstantiateHealth, STD_SPEED } from "../actor2/instantiate"
import { round } from "../actor2/round"
import { applyDamage, applyHeal } from "../health"
import modNodeToText from "../log2/format"
import { decayActionsElapsed, decayEnemyKilled, decayRoundsElapsed, decaySaveSucceeded } from "../status-sheet2/decay"
import runTrigger from "../trigger/dispatch"
import { anyActorAlive, chooseTarget, determineFightWinner, handlePotentialDeath, ownerIsMemberOf } from "./helpers"
import { /* instantiateParticipants */resolveParticipants } from "./setup"
import { snapshotActor, timeTravel } from "../time-travel2"
import { AnyStoredLog, TimeTravelReplayer } from "../time-travel2/replay/types"
import { TimeTravelContext, TTLogMap } from "../time-travel2/types"
import { calculateDamageTicks, calculateHealTicks } from "../status-sheet2/tick"
import { TargetPriority } from "../target/types"
import pickTarget2 from '../target/index'

const VERBOSE = false

export type FightResult = {
    winner: 'player' | 'enemy' | 'draw',
    rounds: number,
    playerActors: Actor2[],
    enemyActors: Actor2[],
    debugData: {
        player0HpStart: number,
        player0HpEnd: number,
    }
}

// picks the first available target
const dumbTargeting: TargetPriority = {
    filters: [],
    simple: 'first',
    team: 'enemy',
}

export const simulateFight = (
    participants: {
        player: OwnerMaximal[] | Actor2[],
        enemy: OwnerMaximal[],
    },
    options?: {
        verbose?: boolean,
        timeTravelReplayer?: TimeTravelReplayer,
    }
    // stageRules:
): FightResult => {
    /* const verbose = options?.verbose ?? false */
    const verbose = false
    const ttr = options?.timeTravelReplayer

    // ====== TTR HELPERS EXTRACT LATER ====== //
    const ttrAppendLog = (log: AnyStoredLog) => {
        // literally just shorten code or loop
        if (!ttr) return
        ttr.appendLog(log)
    }
    const ttrActorContext = (source: Actor2, to: Actor2[]) => () => ({
        source: snapshotActor(source),
        to: to.map(a => snapshotActor(a))
    } as TimeTravelContext)

    const debugData: FightResult['debugData'] = {
        player0HpEnd: 0,
        player0HpStart: 0,
    }

    const playerActors = resolveParticipants(participants.player)
    const enemyActors = resolveParticipants(participants.enemy)
    const actors = [...playerActors, ...enemyActors]

    debugData.player0HpStart = playerActors[0]!.health.curr

    let rounds = 0
    {
        ttrAppendLog(timeTravel['fight-start']({
            source: snapshotActor(playerActors[0]!),
            to: [
                ...actors.map(a => snapshotActor(a))
            ]
        }))
    }

    while (
        // while someone's team has someone alive
        anyActorAlive(enemyActors)
        && anyActorAlive(playerActors)
    ) {
        rounds++
        // decay is health-agnostic; reconcile max health here only when a status expired
        actors.forEach(a => {
            const saves = decaySaveSucceeded(a.owner)
            if (saves.some(s => s.kind === 'succeeded')) reinstantiateHealth(a)
        })

        actors.forEach(a => handlePotentialDeath(actors, a))

        const acting = round({
            participants: actors,
            speedSum: STD_SPEED,
        })
        {
            ttrAppendLog(timeTravel["speed"]({
                actors: acting.map(a => snapshotActor(a)),
            }))
        }

        while (acting.length > 0) {
            const theActor = acting.pop()
            if (!theActor) continue
            ttrAppendLog(timeTravel['act-start']({
                source: snapshotActor(theActor)
            }))

            // an expired status may have changed max health -> reconcile when one did
            const anythingElapsedRounds = !!decayRoundsElapsed(theActor.owner, 1, theActor)
            if (anythingElapsedRounds) reinstantiateHealth(theActor)
            if (!theActor.speed.canAct) continue

            // start action
            const actions = act(theActor)

            const anythingElapsedSpeed = !!decayActionsElapsed(theActor.owner, 1)
            if (anythingElapsedSpeed) reinstantiateHealth(theActor)

            // find the first alive person (target)
            const targetTeam = ownerIsMemberOf(theActor.owner, playerActors) ? enemyActors : playerActors
            const allyTeam = ownerIsMemberOf(theActor.owner, playerActors) ? playerActors : enemyActors
            const target = pickTarget2(
                targetTeam,
                allyTeam,
                dumbTargeting,
            )[0]! // because it's always first
            const snapshotActors = ttrActorContext(theActor, [target])

            const cdt = calculateDamageTicks(theActor)
            for (let { node, source } of cdt) {
                applyDamage(theActor.health, node.total())
                ttrAppendLog(timeTravel["damage-over-time-taken"]({
                    modNode: node,
                    statusSource: source,
                    to: [snapshotActor(theActor)],
                }))
            }

            const cht = calculateHealTicks(theActor)
            for (let { node, source } of cht) {
                applyHeal(theActor.health, node.total())
                ttrAppendLog(timeTravel["heal-over-time-taken"]({
                    modNode: node,
                    statusSource: source,
                    to: [snapshotActor(theActor)],
                }))
            }

            actions.forEach(a => {
                if (actionIsAbility(a)) {
                    // targeting now lives inside the ability's steps
                    const ability = a.factory()
                    const resolutions = resolveAbility(
                        { enemy: targetTeam, ally: allyTeam },
                        theActor,
                        ability,
                    )
                    for (let r of resolutions) {
                        applyResolutions([r])
                        ttrAppendLog(timeTravel['ability']({
                            source: snapshotActor(theActor),
                            to: [snapshotActor(r.target)],
                            resolution: r,
                        }))
                        handlePotentialDeath(actors, r.target, theActor.owner)
                    }
                    return
                }
                if (!target) return
                // resolve action
                const finalSar = outputFinalSar([a], target)
                for (let fs of finalSar) {
                    if (!fs.critDamageResult && !fs.damageResult) {
                    }
                    else if (fs.critDamageResult) {
                        applyDamage(target.health, fs.critDamageResult.total())
                    }
                    else if (fs.damageResult) {
                        applyDamage(target.health, fs.damageResult.total())
                    }
                    ttrAppendLog(timeTravel["standard-action-result"]({
                        ...snapshotActors(),
                        ...fs,
                    }))
                }

                if (target) handlePotentialDeath(actors, target, theActor.owner)
            })
        }
    }

    const { winner } = determineFightWinner(playerActors, enemyActors)
    {
        ttrAppendLog(
            timeTravel["team-victory"]({
                ...ttrActorContext(playerActors[0]!, [])(),
                winner: winner,
            })
        )
    }

    debugData.player0HpEnd = Math.max(playerActors[0]!.health.curr, 0)
    return {
        winner,
        rounds,
        playerActors,
        enemyActors,
        debugData,
    }
}