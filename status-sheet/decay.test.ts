import { describe, test, assert } from 'vitest'
import { decaySpeedElapsed, decayActionsElapsed, decayRoundsElapsed, decaySaveSucceeded, decayEnemyKilled, expireStatusesAfterFight } from './decay'
import { StatusSheet } from './types'
import { StatusEffect } from './core-types'
import { defaultCharacterSheet } from '../character-sheet'
import { defaultFeatSheet } from '../feat'
import { defaultEquipmentSheet } from '../equipment-sheet'
import { createDefaultOwner } from '../defaults'
import blessStatus from './statuses/bless'

const buffStatus = (): StatusEffect => ({
    displayName: 'test status',
    expiration: { kind: 'speed-elapsed', remaining: 0 },
    context: {},
})

const testOwner = (ss: StatusSheet) => ({
    cs: defaultCharacterSheet,
    fs: defaultFeatSheet,
    es: defaultEquipmentSheet,
    ss,
})

describe('decaySpeedElapsed', () => {
    test('removes the status once remaining speed hits zero, keeps it otherwise', () => {
        const owner = testOwner({
            test: { ...buffStatus(), expiration: { kind: 'speed-elapsed', remaining: 10 } },
        })

        decaySpeedElapsed(owner, 6)
        assert.property(owner.ss, 'test')
        assert.equal((owner.ss.test.expiration as any).remaining, 4)

        decaySpeedElapsed(owner, 6)
        assert.notProperty(owner.ss, 'test')
    })

    test('ignores statuses with a different expiration kind', () => {
        const owner = testOwner({
            test: { ...buffStatus(), expiration: { kind: 'actions-elapsed', remaining: 1 } },
        })

        decaySpeedElapsed(owner, 100)
        assert.property(owner.ss, 'test')
    })
})

describe('decayActionsElapsed', () => {
    test('removes the status once the action count hits zero, keeps it otherwise', () => {
        const owner = testOwner({
            test: { ...buffStatus(), expiration: { kind: 'actions-elapsed', remaining: 2 } },
        })

        decayActionsElapsed(owner, 1)
        assert.property(owner.ss, 'test')
        assert.equal((owner.ss.test.expiration as any).remaining, 1)

        decayActionsElapsed(owner, 1)
        assert.notProperty(owner.ss, 'test')
    })
})

describe('decayRoundsElapsed', () => {
    test('removes the status once remaining rounds hits zero, keeps it otherwise', () => {
        const owner = testOwner({
            test: { ...buffStatus(), expiration: { kind: 'rounds-elapsed', remaining: 2 } },
        })

        decayRoundsElapsed(owner, 1)
        assert.property(owner.ss, 'test')
        assert.equal((owner.ss.test.expiration as any).remaining, 1)

        decayRoundsElapsed(owner, 1)
        assert.notProperty(owner.ss, 'test')
    })

    test('chains into onExpiration, replacing the status under the same key', () => {
        const chained: StatusEffect = { ...buffStatus(), displayName: 'chained', expiration: { kind: 'actions-elapsed', remaining: 100 } }
        const owner = testOwner({
            test: {
                ...buffStatus(),
                expiration: { kind: 'rounds-elapsed', remaining: 1 },
                onExpiration: () => chained,
            },
        })

        decayRoundsElapsed(owner, 1)
        assert.property(owner.ss, 'test')
        assert.equal(owner.ss.test.displayName, 'chained')
    })
})

describe('decayRoundsElapsed tick', () => {
    const testActor = (ss: StatusSheet, curr = 10, max = 20) => ({
        owner: testOwner(ss),
        health: { curr, max, temporary: 0 },
        speed: { canAct: true, remainder: 0 },
    })

    test('a damage tick reduces health.curr and the status still decrements/expires normally', () => {
        const actor = testActor({
            test: {
                ...buffStatus(),
                expiration: { kind: 'rounds-elapsed', remaining: 2, tick: () => -3 },
            },
        })

        decayRoundsElapsed(actor.owner, 1, actor)
        assert.equal(actor.health.curr, 7)
        assert.property(actor.owner.ss, 'test')
        assert.equal((actor.owner.ss.test.expiration as any).remaining, 1)

        decayRoundsElapsed(actor.owner, 1, actor)
        assert.equal(actor.health.curr, 4)
        assert.notProperty(actor.owner.ss, 'test')
    })

    test('a heal tick increases health.curr, clamped at max', () => {
        const actor = testActor({
            test: {
                ...buffStatus(),
                expiration: { kind: 'rounds-elapsed', remaining: 1, tick: () => 50 },
            },
        }, 18, 20)

        decayRoundsElapsed(actor.owner, 1, actor)
        assert.equal(actor.health.curr, 20)
    })

    test('tick is skipped without mutation or error when self is omitted', () => {
        const owner = testOwner({
            test: {
                ...buffStatus(),
                expiration: { kind: 'rounds-elapsed', remaining: 1, tick: () => -3 },
            },
        })

        assert.doesNotThrow(() => decayRoundsElapsed(owner, 1))
        assert.notProperty(owner.ss, 'test')
    })

    test('tick fires on the final round before expiry', () => {
        const actor = testActor({
            test: {
                ...buffStatus(),
                expiration: { kind: 'rounds-elapsed', remaining: 1, tick: () => -5 },
            },
        })

        decayRoundsElapsed(actor.owner, 1, actor)
        assert.equal(actor.health.curr, 5)
        assert.notProperty(actor.owner.ss, 'test')
    })
})

describe('decaySaveSucceeded', () => {
    test('removes the status when the roll meets or beats the dc', () => {
        // dc: 1 always succeeds, regardless of the roll (a d20 never rolls below 1)
        const owner = testOwner({
            test: { ...buffStatus(), expiration: { kind: 'save-succeeded' as const, saveContext: [], dc: 1 } },
        })

        decaySaveSucceeded(owner)
        assert.notProperty(owner.ss, 'test')
    })

    test('keeps the status when the roll is below the dc', () => {
        // dc: 999 always fails, regardless of the roll (a d20 never rolls above 20)
        const owner = testOwner({
            test: { ...buffStatus(), expiration: { kind: 'save-succeeded' as const, saveContext: [], dc: 999 } },
        })

        decaySaveSucceeded(owner)
        assert.property(owner.ss, 'test')
    })
})

describe('decayEnemyKilled', () => {
    test('removes the status only when the exact referenced enemy is killed', () => {
        const enemy = { health: { curr: 10 } }
        const enemy2 = { health: { curr: 10 } } // structurally identical, different reference

        const owner = testOwner({
            flanked: { ...buffStatus(), expiration: { kind: 'enemy-killed', enemy } },
        })

        decayEnemyKilled([owner], enemy2)
        assert.property(owner.ss, 'flanked', 'a structurally-equal-but-different object must not trigger removal')

        decayEnemyKilled([owner], enemy)
        assert.notProperty(owner.ss, 'flanked')
    })
})

describe('expireStatusesAfterFight', () => {
    const nonPersistentStatus = (): StatusEffect => ({
        displayName: 'Demo non persistent status',
        expiration: { kind: 'speed-elapsed', remaining: 99999 },
        context: {},
    })
    const persistentStatus = (): StatusEffect => ({
        displayName: 'Persistent Status',
        expiration: { kind: 'speed-elapsed', remaining: 99999 },
        context: {},
        persists: {
            afterBattle: true,
        }
    })

    test('Most statuses should expire after a fight', () => {
        const owner = createDefaultOwner({
            ss: {
                nps: nonPersistentStatus(),
                bless: blessStatus,
            }
        })

        assert.exists(owner.ss.nps)
        assert.exists(owner.ss.bless)

        expireStatusesAfterFight(owner)

        console.log('owner', owner.ss)
        assert.notExists(owner.ss.nps)
        assert.notExists(owner.ss.bless)
    })

    test('Statuses with persists.afterFight persist', () => {
        const owner = createDefaultOwner({
            ss: {
                ps: persistentStatus(),
                bless: blessStatus,
            }
        })

        assert.exists(owner.ss.ps)
        assert.exists(owner.ss.bless)

        expireStatusesAfterFight(owner)

        assert.exists(owner.ss.ps)
        assert.notExists(owner.ss.bless)
    })
})
