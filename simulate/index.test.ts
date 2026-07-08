import { describe, test, assert, afterEach } from 'vitest'
import { simulateFight, worldState } from './index.ts'
import { defaultCharacterSheet, defaultEnemySheet } from '../character-sheet/index.ts'
import { defaultFeatSheet } from '../feat/index.ts'
import { defaultEquipmentSheet } from '../equipment-sheet/index.ts'
import instantiateActor, { Owner } from '../character/actor/index.ts'
import { featAlert } from '../feat/feats/index.ts'
import rollInitiative from '../stat-modifier/initiative/index.ts'
import { setSeed, clearSeed } from '../roll/index.ts'

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
})

describe('worldState', () => {
    afterEach(() => clearSeed())

    test('keeps playerActors\' hp.curr across consecutive fights', () => {
        const ws = worldState({ player: [defaultPlayer] })
        const actor = ws.playerActors[0]
        const startingHp = actor.health.curr

        setSeed(1)
        simulateFight({ player: ws.playerActors, enemy: [defaultEnemy] })
        const afterFirstFight = actor.health.curr
        assert.isBelow(afterFirstFight, startingHp)

        ws.playerAfterFight()

        setSeed(2)
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
