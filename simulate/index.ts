import { act } from "../character/act"
import instantiateActor, { Actor, instantiateAc, instantiateHealth, instantiateSpeed, Owner } from "../character/actor"
import { round, STANDARD_SPEED } from "../speed"
import { decayActionsElapsed, decayEnemyKilled, decaySaveSucceeded } from "../status-sheet/decay"

const instantiateParticipants = (
    participants: Owner[],
): Actor[] => {
    const actors: Actor[] = []

    for (let part of participants) {
        actors.push({
            owner: part,
            health: instantiateHealth(part),
            speed: instantiateSpeed(part),
            ac: instantiateAc(part),
        })
    }

    return actors
}

export const objectIsActor = (d: Record<string, any>): d is Actor => {
    return 'owner' in d && 'health' in d && 'speed' in d
}

const resolveParticipants = (
    participants: Owner[] | Actor[],
): Actor[] => {
    if (participants.length === 0) return []
    if (objectIsActor(participants[0])) return participants as Actor[]
    return instantiateParticipants(participants as Owner[])
}

const chooseTarget = (actors: Actor[]) => {
    const targets = actors.filter(a => a.speed.canAct)
    if (targets.length === 0) return undefined
    return targets[0]
}

// per readme.md: "if the actor rolls high enough, damage applies"
// natural 20 always hits, natural 1 always misses, regardless of modifiers
export const attackHits = (attackRoll: number, ac: number, naturalRoll?: number): boolean => {
    if (naturalRoll === 20) return true
    if (naturalRoll === 1) return false
    return attackRoll >= ac
}

// massively simplified and wrong
const tempAnyActorAlive = (
    actors: Actor[],
) => {
    const canAct = actors.filter(a => a.speed.canAct)
    if (canAct.length > 0) return true
    return false
}

const ownerIsMemberOf = (
    owner: Owner,
    actors: Actor[],
) => {
    if (actors.find(a => {
        return a.owner === owner
    })) return true
    return false
}

export type FightResult = {
    winner: 'player' | 'enemy' | 'draw',
    rounds: number,
    playerActors: Actor[],
    enemyActors: Actor[],
    debugData: {
        player0HpStart: number,
        player0HpEnd: number,
    }
}

// keep the instantiatedActor alive
// this type will probably change - I don't know what we need
export const worldState = (
    participants: {
        player: Owner[],
    }
) => {
    const playerActors: Actor[] = instantiateParticipants(participants.player)

    return {
        playerActors,
        playerAfterFight() {
            // reroll initiative or it will have the leftover initiative from the last fight
            this.playerActors.forEach(a => {
                a.speed = instantiateSpeed(a.owner)
            })
        }
    }
}

export const simulateFight = (
    participants: {
        player: Owner[] | Actor[],
        enemy: Owner[],
    },
    options?: {
        verbose?: boolean,
    }
    // stageRules:
): FightResult => {
    const verbose = options?.verbose ?? false
    // data collection
    const debugData: FightResult['debugData'] = {
        player0HpEnd: 0,
        player0HpStart: 0,
    }

    const playerActors = resolveParticipants(participants.player)
    const enemyActors = instantiateParticipants(participants.enemy)
    const actors = [...playerActors, ...enemyActors]

    // data collection
    debugData.player0HpStart = playerActors[0]!.health.curr

    let rounds = 0
    while (tempAnyActorAlive(enemyActors) && tempAnyActorAlive(playerActors)) {
        rounds++
        actors.forEach(a => decaySaveSucceeded(a.owner))
        const acting = round({
            participants: actors,
            speedSum: STANDARD_SPEED,
        })
        while (acting.length > 0) {
            const theActor = acting.pop()
            if (!theActor) continue
            // died before turn
            if (!theActor.speed.canAct) continue

            // roll
            const action = act(theActor.owner)
            decayActionsElapsed(theActor.owner.ss, 1)
            if (verbose) {
                console.log(`${theActor.owner.cs?.flavorSheet?.displayName || 'Someone'} rolled`)
                console.table(action)
            }

            // find the first alive person
            const targetTeam = ownerIsMemberOf(theActor.owner, playerActors) ? enemyActors : playerActors
            const target = chooseTarget(targetTeam)

            // all actions focus one target for a round
            action.forEach(a => {
                if (!target) return
                const naturalRoll = a.attackLog.finalResult().roll
                if (!attackHits(a.attackRoll, target.ac, naturalRoll)) return
                const isCrit = a.attackLog.finalResult().roll === 20
                target.health.curr -= isCrit ? a.damageRoll * 2 : a.damageRoll
            })
            if (target && target.health.curr <= 0) {
                target.speed.canAct = false
                decayEnemyKilled(actors.map(a => a.owner), target)
            }
        }
    }

    const playerAlive = tempAnyActorAlive(playerActors)
    const enemyAlive = tempAnyActorAlive(enemyActors)
    const winner = playerAlive && !enemyAlive ? 'player' : enemyAlive && !playerAlive ? 'enemy' : 'draw'

    // data collection
    debugData.player0HpEnd = Math.max(playerActors[0]!.health.curr, 0)
    return {
        winner,
        rounds,
        playerActors,
        enemyActors,
        debugData,
    }
}