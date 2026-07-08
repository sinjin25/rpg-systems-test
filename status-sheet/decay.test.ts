import { describe, test, assert } from 'vitest'
import { decaySpeedElapsed, decayActionsElapsed, decaySaveSucceeded, decayEnemyKilled } from './decay'
import { StatusSheet } from './types'
import { StatusEffect } from './core-types'
import { defaultCharacterSheet } from '../character-sheet'
import { defaultFeatSheet } from '../feat'
import { defaultEquipmentSheet } from '../equipment-sheet'

const buffStatus = (): StatusEffect => ({
    displayName: 'test status',
    expiration: { kind: 'speed-elapsed', remaining: 0 },
    context: {},
})

describe('decaySpeedElapsed', () => {
    test('removes the status once remaining speed hits zero, keeps it otherwise', () => {
        const ss: StatusSheet = {
            test: { ...buffStatus(), expiration: { kind: 'speed-elapsed', remaining: 10 } },
        }

        decaySpeedElapsed(ss, 6)
        assert.property(ss, 'test')
        assert.equal((ss.test.expiration as any).remaining, 4)

        decaySpeedElapsed(ss, 6)
        assert.notProperty(ss, 'test')
    })

    test('ignores statuses with a different expiration kind', () => {
        const ss: StatusSheet = {
            test: { ...buffStatus(), expiration: { kind: 'actions-elapsed', remaining: 1 } },
        }

        decaySpeedElapsed(ss, 100)
        assert.property(ss, 'test')
    })
})

describe('decayActionsElapsed', () => {
    test('removes the status once the action count hits zero, keeps it otherwise', () => {
        const ss: StatusSheet = {
            test: { ...buffStatus(), expiration: { kind: 'actions-elapsed', remaining: 2 } },
        }

        decayActionsElapsed(ss, 1)
        assert.property(ss, 'test')
        assert.equal((ss.test.expiration as any).remaining, 1)

        decayActionsElapsed(ss, 1)
        assert.notProperty(ss, 'test')
    })
})

describe('decaySaveSucceeded', () => {
    test('removes the status when the roll meets or beats the dc', () => {
        // dc: 1 always succeeds, regardless of the roll (a d20 never rolls below 1)
        const owner = {
            cs: defaultCharacterSheet,
            fs: defaultFeatSheet,
            es: defaultEquipmentSheet,
            ss: {
                test: { ...buffStatus(), expiration: { kind: 'save-succeeded' as const, saveContext: [], dc: 1 } },
            } as StatusSheet,
        }

        decaySaveSucceeded(owner)
        assert.notProperty(owner.ss, 'test')
    })

    test('keeps the status when the roll is below the dc', () => {
        // dc: 999 always fails, regardless of the roll (a d20 never rolls above 20)
        const owner = {
            cs: defaultCharacterSheet,
            fs: defaultFeatSheet,
            es: defaultEquipmentSheet,
            ss: {
                test: { ...buffStatus(), expiration: { kind: 'save-succeeded' as const, saveContext: [], dc: 999 } },
            } as StatusSheet,
        }

        decaySaveSucceeded(owner)
        assert.property(owner.ss, 'test')
    })
})

describe('decayEnemyKilled', () => {
    test('removes the status only when the exact referenced enemy is killed', () => {
        const enemy = { health: { curr: 10 } }
        const enemy2 = { health: { curr: 10 } } // structurally identical, different reference

        const ss: StatusSheet = {
            flanked: { ...buffStatus(), expiration: { kind: 'enemy-killed', enemy } },
        }

        decayEnemyKilled([{ ss }], enemy2)
        assert.property(ss, 'flanked', 'a structurally-equal-but-different object must not trigger removal')

        decayEnemyKilled([{ ss }], enemy)
        assert.notProperty(ss, 'flanked')
    })
})
