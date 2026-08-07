import roll from "../roll"
import { applyDamage } from "../health"
import { runTrigger } from "../trigger/dispatch"
import { Actor2, OwnerMaximal } from "../actor2"


const instantiateParticipants = (
    participants: OwnerMaximal[],
): Actor2[] => {
    const actors: Actor2[] = []

    for (let part of participants) {
        applyFightStartFeats(part)
        actors.push({
            owner: part,
            health: instantiateHealth(part),
            speed: instantiateSpeed(part),
        })
    }

    return actors
}

export const objectIsActor = (d: Record<string, any>): d is Actor2 => {
    return 'owner' in d && 'health' in d && 'speed' in d
}

const resolveParticipants = (
    participants: OwnerMaximal[] | Actor2[],
): Actor2[] => {
    if (participants.length === 0) return []
    if (objectIsActor(participants[0])) return participants as Actor2[]
    return instantiateParticipants(participants as OwnerMaximal[])
}

const chooseTarget = (actors: Actor2[]) => {
    const targets = actors.filter(a => a.speed.canAct)
    if (targets.length === 0) return undefined
    return targets[0]
}

// massively simplified and wrong
const tempAnyActorAlive = (
    actors: Actor2[],
) => {
    const canAct = actors.filter(a => a.speed.canAct)
    if (canAct.length > 0) return true
    return false
}

const ownerIsMemberOf = (
    owner: OwnerMaximal,
    actors: Actor2[],
) => {
    if (actors.find(a => {
        return a.owner === owner
    })) return true
    return false
}

// resolves a single attack (one entry of act()'s result) against a target
// handle triggers ex: Feat.triggers
export const resolveAction = (
    attacker: Actor2,
    target: Actor2,
    sar: StandardActionResult,
) => {
    const targetAc = calculateAc(target.owner).total

    // roll intercepts
    const intercepts = collectIntercepts(attacker.owner)
    sar = applyIntercepts(attacker, target, sar, intercepts)

    // did it hit?
    const naturalRoll = sar.attackLog.finalResult().roll
    if (!attackHits(sar.attackRoll, targetAc, naturalRoll)) {
        runTrigger({ self: attacker.owner, target: target.owner }, 'onMiss')
        return
    }
    runTrigger({ self: attacker.owner, target: target.owner }, 'onHit')

    // did it threaten? Did it confirm?
    const threatened = isThreat(naturalRoll, sar.critRange)
    const confirmNaturalRoll = sar.confirmLog.finalResult().roll
    const crit = threatened && attackHits(sar.confirmRoll, targetAc, confirmNaturalRoll)

    // extract tags from weapon for usage in figuring out calculateDamageTaken contexts (ex: bludgeon, slashing, etc.)
    const damageTakenContext = extractContextsTags(sar.weapon)

    if (!crit) {
        const damageTaken = calculateDamageTaken(target.owner, sar.damageRoll, damageTakenContext)
        applyDamage(target.health, damageTaken.total)
        runTrigger({ self: target.owner, target: attacker.owner }, 'onDamageTaken')
        return
    }
    runTrigger({ self: attacker.owner, target: target.owner }, 'onCrit')

    const rawRollTotal = sar.damageLog.roll.reduce((acc, r) => acc + r.amount, 0)
    const critDamage = applyCritMultiplier(
        rawRollTotal,
        sar.critScaledDamage.total,
        sar.critFlatDamage.total,
        sar.critMultiplier,
    )

    // currently attack -> crit -> damage taken mods
    applyDamage(target.health, calculateDamageTaken(target.owner, critDamage.total, damageTakenContext).total)
    runTrigger({ self: target.owner, target: attacker.owner }, 'onDamageTaken')
}

// resolves one ability entry of act()'s result against a target: the defender
// rolls the save against the precalc'd dc (mirroring decaySaveSucceeded), damage
// picks the full or passed-save roll, and a failed save applies the ability's status
export const resolveAbility = (
    attacker: Actor2,
    target: Actor2,
    aar: AbilityActionResult,
) => {
    let passed = false
    if (aar.save) {
        const saveMod = saveModifierFactories[aar.save.type](target.owner)()
        const natural = roll(20)
        passed = saveSucceeds(natural + saveMod.total, aar.save.dc, natural)
    }

    if (aar.damage) {
        const damage = passed
            ? aar.damage.passedSaveDamageRoll ?? 0
            : aar.damage.damageRoll
        if (damage > 0) {
            // TODO: there are no abilities with tags right now
            applyDamage(target.health, calculateDamageTaken(target.owner, damage, []).total)
            runTrigger({ self: target.owner, target: attacker.owner }, 'onDamageTaken')
        }
    }

    if (aar.save && !passed && aar.ability.onFailedSave) {
        const status = aar.ability.onFailedSave(aar.save.dc)
        // no stacking - same guard as trigger/apply
        if (!target.owner.ss[status.displayName]) target.owner.ss[status.displayName] = status
    }

    // for saveless status effects (ex: studied target)
    if (aar.ability.onUse) {
        const status = aar.ability.onUse()
        if (!target.owner.ss[status.displayName]) target.owner.ss[status.displayName] = status
    }
}

// marks a dead actor unable to act and runs the associated decay/trigger bookkeeping.
// killer is omitted for deaths not attributable to an attacker (e.g. a DoT tick),
// which intentionally skips firing onKill since there's no correct self to attribute it to
const handleDeath = (
    actors: Actor2[],
    target: Actor2,
    killer?: OwnerMaximal,
) => {
    if (target.health.curr > 0) return
    target.speed.canAct = false
    decayEnemyKilled(actors.map(a => a.owner), target)
    if (killer) runTrigger({ self: killer, target: target.owner }, 'onKill')
}

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

// keep the instantiatedActor alive
// this type will probably change - I don't know what we need
export const worldState = (
    participants: {
        player: OwnerMaximal[],
    }
) => {
    const playerActors: Actor2[] = instantiateParticipants(participants.player)

    return {
        playerActors,
        playerAfterFight() {
            // reroll initiative or it will have the leftover initiative from the last fight,
            // and re-grant fight-start feats (e.g. Divine Protection) for the new fight
            this.playerActors.forEach(a => {
                expireStatusesAfterFight(a.owner)
                applyFightStartFeats(a.owner)
                resetAbilityCursors(a.owner)
                a.speed = instantiateSpeed(a.owner)
            })
        },
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
    // data collection
    const debugData: FightResult['debugData'] = {
        player0HpEnd: 0,
        player0HpStart: 0,
    }

    const playerActors = resolveParticipants(participants.player)
    // this is ALSO the targeting priority but not the order in which participants act (see speed/index.ts)
    const enemyActors = instantiateParticipants(participants.enemy)
    const actors = [...playerActors, ...enemyActors]

    // data collection
    debugData.player0HpStart = playerActors[0]!.health.curr

    let rounds = 0
    while (tempAnyActorAlive(enemyActors) && tempAnyActorAlive(playerActors)) {
        rounds++
        actors.forEach(a => decaySaveSucceeded(a.owner))
        // I think this should be only when they actually act
        // (this is a balance question)
        /* actors.forEach(a => decayRoundsElapsed(a.owner, 1, a)) */
        actors.forEach(a => handleDeath(actors, a))
        const acting = round({
            participants: actors,
            speedSum: STANDARD_SPEED,
        })
        while (acting.length > 0) {
            const theActor = acting.pop()
            if (!theActor) continue
            // died before turn
            const found = actors
                .find(a => a.owner === theActor.owner)
            if (found) decayRoundsElapsed(found.owner, 1, found)
            if (!theActor.speed.canAct) continue

            // roll
            const action = act(theActor.owner)
            decayActionsElapsed(theActor.owner, 1)
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
                // find self (TurnData is not Actor)
                const self = actors.find(x => x.owner === theActor.owner)!
                // no discriminant on purpose: the shapes share nothing, so this one
                // spot sorts them out structurally (see objectIsActor)
                if ('ability' in a) resolveAbility(self, target, a)
                else resolveAction(self, target, a)
            })
            if (target) handleDeath(actors, target, theActor.owner)
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