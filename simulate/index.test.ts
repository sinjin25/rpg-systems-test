import { describe, test, assert, afterEach } from 'vitest'
import { resolveAbility, simulateFight, worldState } from './index.ts'
import { Ability, addAbility, createDefaultAbilitySheet } from '../ability-sheet/index.ts'
import ignite from '../ability-sheet/abilities/ignite.ts'
import useAbility from '../character/act/ability/index.ts'
import { act } from '../character/act/index.ts'
import { attackHits } from '../character/act/attack-hits.ts'
import { defaultCharacterSheet, defaultEnemySheet } from '../character-sheet/index.ts'
import { defaultFeatSheet } from '../feat/index.ts'
import { defaultEquipmentSheet } from '../equipment-sheet/index.ts'
import instantiateActor, { Owner } from '../character/actor/index.ts'
import { featAlert } from '../feat/feats/index.ts'
import rollInitiative from '../stat-modifier/initiative/index.ts'
import { setSeed, clearSeed } from '../roll/index.ts'
import { round, STANDARD_SPEED } from '../speed/index.ts'
import { Feat } from '../feat/core-types.ts'
import { createDefaultOwner } from '../defaults/index.ts'

const defaultPlayer: Owner = {
    cs: defaultCharacterSheet,
    fs: defaultFeatSheet,
    es: defaultEquipmentSheet,
    ss: {},
    as: createDefaultAbilitySheet(),
}

const defaultEnemy: Owner = {
    cs: defaultEnemySheet,
    fs: defaultFeatSheet,
    es: defaultEquipmentSheet,
    ss: {},
    as: createDefaultAbilitySheet(),
}

describe('simulateFight', () => {
    test('runs to completion between a player and an enemy', () => {
        assert.doesNotThrow(() => {
            simulateFight({
                player: [defaultPlayer],
                enemy: [defaultEnemy],
            })
        })
    })

    test('decays an actions-elapsed status on an actor once they act', () => {
        const actor = instantiateActor(defaultPlayer)
        actor.owner.ss.test = { displayName: 'test', context: {}, expiration: { kind: 'actions-elapsed', remaining: 1 } }

        // a completed fight (>0 rounds) guarantees the player acted at least once
        const result = simulateFight({
            player: [actor],
            enemy: [defaultEnemy],
        })

        assert.isAbove(result.rounds, 0)
        assert.notProperty(actor.owner.ss, 'test')
    })
})

describe('trigger hooks', () => {
    afterEach(() => clearSeed())

    test('a feat\'s onMiss hook applies its TriggerEffect to the actual target during a fight', () => {
        setSeed(1)
        const featTestOnMiss: Feat = {
            displayName: 'Test On Miss',
            context: {},
            trigger: {
                onMiss: () => ({
                    kind: 'apply-status',
                    recipient: 'target',
                    key: 'testOnMissStatus',
                    status: { displayName: 'Test On Miss Status', context: {}, expiration: { kind: 'rounds-elapsed', remaining: 999 } },
                }),
            },
        }
        // since we are using a simulated fight, it needs to end, but you do need to miss.
        const enemy = createDefaultOwner({ cs: { ...defaultEnemySheet, dex: 25 } })
        const attacker = createDefaultOwner({ fs: { featTestOnMiss } as any })

        const result = simulateFight({
            player: [attacker],
            enemy: [enemy],
        })

        assert.isAbove(result.rounds, 0)
        assert.property(result.enemyActors[0]!.owner.ss, 'testOnMissStatus')
    })
})

describe('resolveAbility', () => {
    afterEach(() => clearSeed())

    // dc 999 fails for any save except a natural 20; the seed pins the
    // defender's d20 so the outcome is deterministic
    const testNuke: Ability = {
        displayName: 'Test Nuke',
        keyStat: 'con',
        castType: 'standard',
        contexts: [],
        damage: () => 5,
        save: { type: 'reflex', baseDc: 999, damageOnPass: 'none' },
        onFailedSave: (dc) => ({
            displayName: 'Test Nuke Debuff',
            context: {},
            expiration: { kind: 'save-succeeded', saveType: 'reflex', dc },
        }),
    }

    test('a failed save takes full damage and the onFailedSave status', () => {
        const attacker = instantiateActor(createDefaultOwner({}))
        const target = instantiateActor(createDefaultOwner({}))
        const aar = useAbility({ ...attacker.owner, ability: testNuke })
        const hpBefore = target.health.curr

        setSeed(1)
        resolveAbility(attacker, target, aar)

        assert.equal(target.health.curr, hpBefore - aar.damage!.damageRoll)
        assert.property(target.owner.ss, 'Test Nuke Debuff')
    })

    test('a passed save against damageOnPass none takes no damage and no status', () => {
        const attacker = instantiateActor(createDefaultOwner({}))
        const target = instantiateActor(createDefaultOwner({}))
        // dc -999 passes for any save except a natural 1
        const nuke2: Ability = { ...testNuke, save: { type: 'reflex', baseDc: -999, damageOnPass: 'none' } }
        const aar = useAbility({ ...attacker.owner, ability: nuke2 })
        const hpBefore = target.health.curr

        setSeed(1)
        resolveAbility(attacker, target, aar)

        assert.equal(target.health.curr, hpBefore)
        assert.notProperty(target.owner.ss, 'Test Nuke Debuff')
    })

    test('an ability without a save always applies its damage', () => {
        const attacker = instantiateActor(createDefaultOwner({}))
        const target = instantiateActor(createDefaultOwner({}))
        const bolt: Ability = {
            displayName: 'Test Bolt',
            keyStat: 'con',
            castType: 'standard',
            contexts: [],
            damage: () => 5,
        }
        const aar = useAbility({ ...attacker.owner, ability: bolt })
        const hpBefore = target.health.curr

        resolveAbility(attacker, target, aar)

        assert.equal(target.health.curr, hpBefore - aar.damage!.damageRoll)
    })

    test('a fight where the player opens with a standard ability runs to completion', () => {
        const player = createDefaultOwner({})
        addAbility(player.as, ignite)

        const result = simulateFight({
            player: [player],
            enemy: [createDefaultOwner({ cs: defaultEnemySheet })],
        })

        assert.isAbove(result.rounds, 0)
    })
})

describe('attackHits', () => {
    test('a roll equal to ac hits', () => {
        assert.isTrue(attackHits(15, 15))
    })

    test('a roll below ac misses', () => {
        assert.isFalse(attackHits(14, 15))
    })

    test('a roll above ac hits', () => {
        assert.isTrue(attackHits(20, 5))
    })

    test('a natural 20 always hits, even against an unbeatable ac', () => {
        assert.isTrue(attackHits(20, 999, 20))
    })

    test('a natural 1 always misses, even against an ac of 0', () => {
        assert.isFalse(attackHits(1, 0, 1))
    })
})

describe('worldState', () => {
    afterEach(() => clearSeed())

    test('keeps playerActors\' hp.curr across consecutive fights', () => {
        // seeded before worldState() so the initiative roll it triggers (via
        // instantiateSpeed) is deterministic too, not just the fight itself
        // (seed 1 coincidentally lands both fights on the same hp total now that
        // act() draws an extra d20 per attack for the crit confirmation roll)
        setSeed(2)
        const ws = worldState({ player: [defaultPlayer] })
        const actor = ws.playerActors[0]
        const startingHp = actor.health.curr

        simulateFight({ player: ws.playerActors, enemy: [defaultEnemy] })
        const afterFirstFight = actor.health.curr
        assert.isBelow(afterFirstFight, startingHp)

        ws.playerAfterFight()

        simulateFight({ player: ws.playerActors, enemy: [defaultEnemy] })
        const afterSecondFight = actor.health.curr

        // hp continues from where the last fight left it, it does not reset to max
        assert.isBelow(afterSecondFight, afterFirstFight)
    })

    test('playerAfterFight rerolls initiative (including feats), discarding the leftover remainder', () => {
        const owner: Owner = {
            cs: { ...defaultCharacterSheet, dex: 10 },
            fs: { featAlert },
            es: {},
            ss: {},
            as: createDefaultAbilitySheet(),
        }
        const ws = worldState({ player: [owner] })
        const actor = ws.playerActors[0]

        // stand in for whatever remainder a fight would have left on the actor
        actor.speed.remainder = 999

        setSeed(5)
        ws.playerAfterFight()
        const rerolled = actor.speed.remainder

        // an independent call with the same seed proves the reroll is a fresh
        // rollInitiative (feat bonus included), not the stale leftover value
        setSeed(5)
        const expected = rollInitiative(owner)

        assert.notEqual(rerolled, 999)
        assert.equal(rerolled, expected.total)
    })

    test('playerAfterFight resets the ability cursors on every slot', () => {
        const owner = createDefaultOwner({})
        addAbility(owner.as, ignite)
        const ws = worldState({ player: [owner] })

        // stand in for wherever a fight would have left the cursors
        owner.as.standard.index = 1
        owner.as.swift.index = 2
        owner.as.free.index = 3

        ws.playerAfterFight()

        assert.equal(owner.as.standard.index, 0)
        assert.equal(owner.as.swift.index, 0)
        assert.equal(owner.as.free.index, 0)

        // the reset re-arms the standard slot: the next turn casts instead of attacking
        const turn = act(owner)
        assert.property(turn[0], 'ability')
    })

    test('documents behavior: a fight ends immediately if the player starts unable to act', () => {
        const deadActor = instantiateActor(defaultPlayer)
        deadActor.health.curr = 0
        deadActor.speed.canAct = false

        const result = simulateFight({
            player: [deadActor],
            enemy: [defaultEnemy],
        })

        // tempAnyActorAlive only checks canAct, so the fight loop's condition
        // fails before the first round ever runs
        assert.equal(result.rounds, 0)
        assert.equal(result.winner, 'enemy')
    })
})

describe('flat-footed', () => {
    test('every actor starts flat-footed and loses it once enough speed elapses to act', () => {
        const actor = instantiateActor(defaultPlayer)
        assert.property(actor.owner.ss, 'flatFooted')

        const roundData = {
            participants: [{ owner: actor.owner, speed: actor.speed }],
            speedSum: STANDARD_SPEED,
        }

        // running enough rounds guarantees the actor eventually acts, since
        // flat-footed's duration is seeded to expire exactly at that point
        for (let i = 0; i < 200 && actor.owner.ss.flatFooted; i++) round(roundData)

        assert.notProperty(actor.owner.ss, 'flatFooted')
    })
})
