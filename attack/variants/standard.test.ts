import standard from './standard.ts'
import { describe, test, assert, expect } from 'vitest'

import standardAttackModifierFactory, { default as defaultAttack } from './standard.ts'
import { DEFAULT_STAT, defaultCharacterSheet } from '../../character-sheet/index.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import finesseAttackModifierFactory from './finesse.ts'
import { shortsword } from '../../equipment-sheet/variants/dagger.ts'

describe('standard functionality', () => {
    test('produces a number', () => {
        const std = standardAttackModifierFactory({
            characterSheet: {
                con: 10,
                dex: 10,
                str: 14,
            },
            equipmentSheet: {},
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: shortsword,
        })

        const result = std()
        assert.equal(result, 2)
    })
})

describe('Can be extended', () => {
    test('scales off strength, not dex', () => {
        const standard = standardAttackModifierFactory({
            characterSheet: {
                con: 10,
                dex: 12,
                str: 10,
            },
            equipmentSheet: {},
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: shortsword,
        })

        const result = standard()
        assert.equal(result, 0)
    })
    test('Can get a negative modifier', () => {
        const standard = standardAttackModifierFactory({
            characterSheet: {
                con: 10,
                dex: 12,
                str: 8,
            },
            equipmentSheet: {},
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: shortsword,
        })

        const result = standard()
        assert.equal(result, -1)
    })
})