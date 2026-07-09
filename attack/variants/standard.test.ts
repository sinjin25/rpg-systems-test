import { describe, test, assert, expect } from 'vitest'

import standardAttackModifierFactory, { default as defaultAttack } from './standard.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { shortsword } from '../../defaults/equipment/index.ts'
import { defaultEquipmentSheet } from '../../defaults/index.ts'
import { featFinesseWeaponFighting } from '../../feat/feats/index.ts'

describe('standard functionality', () => {
    test('produces a number', () => {
        const std = standardAttackModifierFactory({
            cs: {
                con: 10,
                dex: 10,
                str: 14,
                level: 1,
            },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
            weapon: shortsword,
        })

        const result = std()
        assert.equal(result.total, 2)
    })
})

describe('Can be extended', () => {
    test('scales off strength, not dex', () => {
        const standard = standardAttackModifierFactory({
            cs: {
                con: 10,
                dex: 12,
                str: 10,
                level: 1,
            },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
            weapon: shortsword,
        })

        const result = standard()
        assert.equal(result.total, 0)
    })
    test('Can get a negative modifier', () => {
        const standard = standardAttackModifierFactory({
            cs: {
                con: 10,
                dex: 12,
                str: 8,
                level: 1,
            },
            es: defaultEquipmentSheet,
            fs: defaultFeatSheet,
            ss: {},
            weapon: shortsword,
        })

        const result = standard()
        assert.equal(result.total, -1)
    })
    test('is not affected by finesse changes', () => {
        const standard = standardAttackModifierFactory({
            cs: {
                con: 10,
                dex: 12,
                str: 10,
                level: 1,
            },
            es: defaultEquipmentSheet,
            fs: {
                ...defaultFeatSheet,
                featFinesseWeaponFighting,
            },
            ss: {},
            weapon: shortsword,
        })

        assert.equal(standard().total, 0)
    })
})