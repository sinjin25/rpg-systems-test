import { Actor2, instantiateActor, OwnerMaximal } from "../actor2"
import { act, actionIsAbilityModNode, handleAbilityModNodes, outputFinalSar } from "../actor2/act"
import { instantiateSpeed, STD_SPEED } from "../actor2/instantiate"
import { round } from "../actor2/round"
import { applyDamage } from "../health"
import modNodeToText from "../log2/format"
import { decayActionsElapsed, decayEnemyKilled, decayRoundsElapsed, decaySaveSucceeded } from "../status-sheet2/decay"
import runTrigger from "../trigger/dispatch"
import { anyActorAlive, chooseTarget, handlePotentialDeath, ownerIsMemberOf } from "./helpers"
import { /* instantiateParticipants */resolveParticipants } from "./setup"
import { snapshotActor, timeTravel } from "./time-travel2"
import { AnyStoredLog, TimeTravelReplayer } from "./time-travel2/replay/types"
import { TimeTravelContext, TTLogMap } from "./time-travel2/types"

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
    /* const finishTTRLogInput = <K extends TimeTravelLog['kind']>(kind: K) =>
        (log: Omit<Extract<TimeTravelLog, { kind: K }>, 'kind' | 'context'>): Extract<TimeTravelLog, { kind: K }> => ({
            // Extract narrows the union to the one member with this kind, so the
            // log arg only asks for that variant's own fields (context is added later)
            kind,
            ...log,
        } as Extract<TimeTravelLog, { kind: K }>) */
    // ====== TTR HELPERS EXTRACT LATER ====== //

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
            source: playerActors[0]!,
            to: [...actors]
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

        while (acting.length > 0) {
            const theActor = acting.pop()
            if (!theActor) continue

            decayRoundsElapsed(theActor.owner, 1, theActor)
            if (!theActor.speed.canAct) continue

            // start action
            const actions = act(theActor)

            decayActionsElapsed(theActor.owner, 1)

            // find the first alive person (target)
            const targetTeam = ownerIsMemberOf(theActor.owner, playerActors) ? enemyActors : playerActors
            const target = chooseTarget(targetTeam)
            const snapshotActors = ttrActorContext(theActor, [target])

            // setup ttActorContext

            actions.forEach(a => {
                if (!target) return
                if (actionIsAbilityModNode(a)) {
                    // resolve ability
                    handleAbilityModNodes(theActor, target, [a])
                } else {
                    // resolve action
                    const finalSar = outputFinalSar([a], target)
                    for (let fs of finalSar) {
                        if (!fs.critDamageResult && !fs.damageResult) {
                        } else if (fs.critDamageResult) {
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
                }

                if (target) handlePotentialDeath(actors, target, theActor.owner)
            })
        }
    }

    const playerAlive = anyActorAlive(playerActors)
    const enemyAlive = anyActorAlive(enemyActors)
    const winner = playerAlive && !enemyAlive ? 'player' : enemyAlive && !playerAlive ? 'enemy' : 'draw'
    if (ttr) {
        const snapshot = ttrActorContext(playerActors[0]!, [])
        ttrAppendLog(
            timeTravel["team-victory"]({
                ...snapshot(),
                winner,
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