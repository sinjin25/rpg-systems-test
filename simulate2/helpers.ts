import { Actor2, OwnerMaximal } from "../actor2"
import { decayEnemyKilled } from "../status-sheet2/decay"
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
) => actor.speed.canAct

// given some subset of actors, choose the first available one (.speed.canAct)
// speed.canAct is a stand in because it's only false when you're dead
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

export const handlePotentialDeath = (
    actors: Actor2[],
    target: Actor2,
    killer?: OwnerMaximal,
) => {
    if (target.health.curr > 0) return
    target.speed.canAct = false
    decayEnemyKilled(actors.map(a => a.owner), target)
    // ?????????
    /* if (killer) runTrigger({ self: killer, target: target.owner }, 'onKill') */
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