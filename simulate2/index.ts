import { Actor2, instantiateActor, OwnerMaximal } from "../actor2"
import { act, actionIsAbilityModNode, handleAbilityModNodes, outputFinalSar } from "../actor2/act"
import { instantiateSpeed, STD_SPEED } from "../actor2/instantiate"
import { round } from "../actor2/round"
import { applyDamage } from "../health"
import modNodeToText from "../log2/format"
import { decayActionsElapsed, decayEnemyKilled, decayRoundsElapsed, decaySaveSucceeded } from "../status-sheet2/decay"
import runTrigger from "../trigger/dispatch"
import { anyActorAlive, chooseTarget, determineFightWinner, handlePotentialDeath, ownerIsMemberOf } from "./helpers"
import { /* instantiateParticipants */resolveParticipants } from "./setup"
import { snapshotActor, timeTravel } from "../time-travel2"
import { AnyStoredLog, TimeTravelReplayer } from "../time-travel2/replay/types"
import { TimeTravelContext, TTLogMap } from "../time-travel2/types"
import { calculateDamageTicks } from "../status-sheet2/tick"

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
        source: snapshotActor(source.id)(source),
        to: to.map(a => snapshotActor(a.id)(a))
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
            source: snapshotActor(playerActors[0]!.id)(playerActors[0]!),
            to: [
                ...actors.map(a => snapshotActor(a.id)(a))
            ]
        }))
    }

    while (
        // while someone's team has someone alive
        anyActorAlive(enemyActors)
        && anyActorAlive(playerActors)
    ) {
        rounds++
        actors.forEach(a => decaySaveSucceeded(a.owner))

        actors.forEach(a => handlePotentialDeath(actors, a))

        const acting = round({
            participants: actors,
            speedSum: STD_SPEED,
        })
        {
            ttrAppendLog(timeTravel["speed"]({
                actors: acting.map(a => snapshotActor(a.id)(a)),
            }))
        }

        while (acting.length > 0) {
            const theActor = acting.pop()
            if (!theActor) continue
            ttrAppendLog(timeTravel['act-start']({
                source: snapshotActor(theActor.id)(theActor)
            }))

            decayRoundsElapsed(theActor.owner, 1, theActor)
            if (!theActor.speed.canAct) continue

            // start action
            const actions = act(theActor)

            decayActionsElapsed(theActor.owner, 1)

            // find the first alive person (target)
            const targetTeam = ownerIsMemberOf(theActor.owner, playerActors) ? enemyActors : playerActors
            const target = chooseTarget(targetTeam)
            const snapshotActors = ttrActorContext(theActor, [target])

            const cdt = calculateDamageTicks(theActor)
            for (let { node, source } of cdt) {
                applyDamage(theActor.health, node.total())
                ttr.appendLog(timeTravel["damage-over-time-taken"]({
                    modNode: node,
                    statusSource: source,
                    to: [snapshotActor(theActor.id)(theActor)],
                }))
            }

            actions.forEach(a => {
                if (!target) return
                if (actionIsAbilityModNode(a)) {
                    // see time-travel/ability.test.ts
                    // we probably need a gamn before a hamn?
                    // alternatively, a is the gamn so we just hamn
                    handleAbilityModNodes(theActor, target, [a])
                    ttrAppendLog(timeTravel[''])
                    return
                }
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