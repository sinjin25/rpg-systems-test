import { resetAbilityCategoryIndex } from "../ability-sheet2"
import type { AbilityCastType } from "../ability-sheet2/types"
import type { Actor2, OwnerMaximal } from "../actor2/types"
import { applyOnFightStartFeatHandlers, getOnFightStartFeatHandlers } from "../feat2/fight-start"
import type { FeatIds } from "../feat2/types"
import { decayEnemyKilled, expireStatusesAfterFight } from "../status-sheet2/decay"
import { snapshotActor, timeTravel } from "../time-travel2"
import { TimeTravelReplayer } from "../time-travel2/replay/types"
/* import runTrigger from "../trigger/dispatch" */

// helper for figuring out whose team someone belongs to (ex: are they a member of some subset of all the actors)
export const ownerIsMemberOf = (
    owner: OwnerMaximal,
    actors: Actor2[],
) => {
    if (actors.find(a => {
        return a.owner === owner
    })) return true
    return false
}

// this will become wrong eventually
export const targetIsAlive = (
    actor: Actor2
) => actor.speed.isAlive

// given some subset of actors, choose the first available one (.speed.isAlive)
// speed.isAlive is a stand in because it's only false when you're dead
export const chooseTarget = (actors: Actor2[]) => {
    const targets = actors.filter(targetIsAlive)
    if (targets.length === 0) return undefined
    return targets[0]
}

// for some subset of actors (a team) is anyone alive?
export const anyActorAlive = (
    actors: Actor2[],
) => {
    const canAct = actors.filter(targetIsAlive)
    if (canAct.length > 0) return true
    return false
}

// Returns true if the target died (health <= 0), false otherwise.
// this is a bad return as we want a log
export const handlePotentialDeath = (
    actors: Actor2[],
    target: Actor2,
    killer?: OwnerMaximal,
): boolean => {
    if (target.health.curr > 0) return false
    target.speed.isAlive = false
    decayEnemyKilled(actors.map(a => a.owner), target)
    // ?????????
    /* if (killer) runTrigger({ self: killer, target: target.owner }, 'onKill') */
    return true
}

export const determineFightWinner = (
    players: Actor2[],
    enemies: Actor2[],
): {
    winner: 'player' | 'enemy' | 'draw'
} => {
    const playerAlive = anyActorAlive(players)
    const enemyAlive = anyActorAlive(enemies)

    const winner = playerAlive && !enemyAlive ? 'player' : enemyAlive && !playerAlive ? 'enemy' : 'draw'

    return {
        winner,
    }
}

export const handlePostFight = (
    actors: Actor2[],
    timeTravelReplayer?: TimeTravelReplayer<any>,
) => {
    actors.forEach(a => {
        expireStatusesAfterFight(a.owner)
        for (const cat of ['free', "standard", "swift"] as AbilityCastType[]) {
            resetAbilityCategoryIndex(a.owner, cat)
        }

        if (timeTravelReplayer) {
            timeTravelReplayer.appendLog(
                timeTravel['post-fight']({
                    source: snapshotActor(a),
                })
            )
        }
    })
}

export const handlePreFight = (
    actors: Actor2[],
    timeTravelReplayer?: TimeTravelReplayer<any>,
) => {
    actors.forEach(a => {
        const handlers = getOnFightStartFeatHandlers(a.owner)
        if (handlers.length === 0) return

        applyOnFightStartFeatHandlers(a.owner, handlers)

        if (timeTravelReplayer) {
            timeTravelReplayer.appendLog(
                timeTravel['pre-fight-feat-applied']({
                    featsTriggered: handlers.map(a => a[1].displayName as FeatIds),
                    source: snapshotActor(a),
                })
            )
        }
    })
}