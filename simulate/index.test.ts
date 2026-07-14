import { describe, test, assert, afterEach } from 'vitest'
import { simulateFight, worldState } from './index.ts'
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
}

const defaultEnemy: Owner = {
    cs: defaultEnemySheet,
    fs: defaultFeatSheet,
    es: defaultEquipmentSheet,
    ss: {},
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
