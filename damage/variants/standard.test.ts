import { describe, test, assert, expect } from 'vitest'

import standardDamageModifierFactory from './standard.ts'
import { defaultFeatSheet, FeatSheet } from '../../feat/index.ts'
import { daggerPlusOne, shortsword, strDagger } from '../../defaults/equipment/index.ts'
import { featMeleeWeaponFighting } from '../../feat/feats/index.ts'
import { defaultEquipmentSheet } from '../../equipment-sheet/index.ts'

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

    // the weapon's own context tags are passed to the feat reducer,
    // matching the standard attack variant's behavior
    test('melee damage feat applies via the weapon context tags', () => {
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

        // bm(2) + fm(1, shortsword is tagged melee)
        const result = standard()
        assert.equal(result, 3)
    })

    test('weapon enhancement applies to damage through the equipment mod', () => {
        const standard = standardDamageModifierFactory({
            characterSheet: {
                con: 10,
                dex: 10,
                str: 14,
            },
            equipmentSheet: { mainhand: daggerPlusOne },
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: daggerPlusOne,
        })

        // bm(2) + em(1, the dagger's +1 enhancement)
        const result = standard()
        assert.equal(result, 3)
    })
})
