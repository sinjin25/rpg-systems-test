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

const VERBOSE = true

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
    }
    // stageRules:
): FightResult => {
    const verbose = options?.verbose ?? false

    const debugData: FightResult['debugData'] = {
        player0HpEnd: 0,
        player0HpStart: 0,
    }

    const playerActors = resolveParticipants(participants.player)
    const enemyActors = resolveParticipants(participants.enemy)
    const actors = [...playerActors, ...enemyActors]

    debugData.player0HpStart = playerActors[0]!.health.curr

    let rounds = 0

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

            /* const found = actors.find(a => a.owner === theActor.owner)
            if (found) decayRoundsElapsed(found.owner, 1, found) */
            decayRoundsElapsed(theActor.owner, 1, theActor)
            if (!theActor.speed.canAct) continue

            // start action
            const actions = act(theActor)

            decayActionsElapsed(theActor.owner, 1)

            // find the first alive person (target)
            const targetTeam = ownerIsMemberOf(theActor.owner, playerActors) ? enemyActors : playerActors
            const target = chooseTarget(targetTeam)

            actions.forEach(a => {
                if (!target) return
                if (actionIsAbilityModNode(a)) {
                    // resolve ability
                    handleAbilityModNodes(theActor, target, [a])
                } else {
                    // resolve action
                    const finalSar = outputFinalSar([a], target)
                    for (let fs of finalSar) {
                        // should only be 1
                        /* console.log('fs', fs) */
                        if (verbose) console.log(
                            '\x1b[31m',
                            theActor.owner.cs.flavorSheet.displayName,
                            '\x1b[0m\nattacks\n',
                            modNodeToText(fs.attackResult),
                            '\nvs\n', modNodeToText(fs.acResult)
                        )
                        if (fs.critDamageResult) {
                            if (verbose) console.log(
                                '\x1b[31m',
                                theActor.owner.cs.flavorSheet.displayName, 'crits', modNodeToText(fs.critDamageResult),
                                '\x1b[0m\n')
                            applyDamage(target.health, fs.critDamageResult.total())
                        }
                        else if (fs.damageResult) {
                            if (verbose) console.log(theActor.owner.cs.flavorSheet.displayName, 'hits', modNodeToText(fs.damageResult))
                            applyDamage(target.health, fs.damageResult.total())
                        }
                        else {
                            // we missed
                        }
                    }
                }

                if (target) handlePotentialDeath(actors, target, theActor.owner)
            })
        }
    }

    const playerAlive = anyActorAlive(playerActors)
    const enemyAlive = anyActorAlive(enemyActors)
    const winner = playerAlive && !enemyAlive ? 'player' : enemyAlive && !playerAlive ? 'enemy' : 'draw'

    debugData.player0HpEnd = Math.max(playerActors[0]!.health.curr, 0)
    return {
        winner,
        rounds,
        playerActors,
        enemyActors,
        debugData,
    }
}