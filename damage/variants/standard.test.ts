import { describe, test, assert, expect } from 'vitest'

import standardDamageModifierFactory from './standard.ts'
import { defaultFeatSheet, FeatSheet } from '../../feat/index.ts'
import { shortsword } from '../../defaults/equipment/index.ts'
import { featMeleeWeaponFighting } from '../../feat/feats/index.ts'

describe('standard functionality', () => {
    test('produces a number', () => {
        const std = standardDamageModifierFactory({
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

    test('scales off strength, not dex', () => {
        const standard = standardDamageModifierFactory({
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

    // standard variant does not pass any active contexts to the feat reducer,
    // matching the existing standard attack variant's behavior
    test('melee damage feat does not apply (no active contexts passed)', () => {
        const fs: FeatSheet = {
            ...defaultFeatSheet,
            featMeleeWeaponFighting,
        }
        const standard = standardDamageModifierFactory({
            characterSheet: {
                con: 10,
                dex: 10,
                str: 14,
            },
            equipmentSheet: {},
            featSheet: fs,
            statusSheet: {},
            weapon: shortsword,
        })

        const result = standard()
        assert.equal(result, 2)
    })
})
