import { default as finesseAttackModifierFactory } from './finesse'
import { describe, test, assert, expect } from 'vitest'
import { CharacterSheet } from '../../character-sheet'
import { addFeat, FeatSheet } from '../../feat'
import { defaultCharacterSheet, defaultFeatSheet } from '../../defaults'
import { dagger } from '../../defaults/equipment'

describe('factory works', () => {
    test('default character sheet', () => {
        const myFunc = finesseAttackModifierFactory({
            characterSheet: defaultCharacterSheet,
            equipmentSheet: {},
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: dagger,
        })

        const result = myFunc()
        assert.equal(result, 2)
    })
    test('works with arbitrary sheets', () => {
        const myFunc = finesseAttackModifierFactory({
            characterSheet: {
                con: 0,
                dex: 0,
                str: 0,
            },
            equipmentSheet: {},
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: dagger,
        })

        const result = myFunc()
        assert.equal(result, -5)
    })
    test('works with feat sheets', () => {
        const fs: FeatSheet = {
            ...defaultFeatSheet,
        }
        const cs: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 16,
        }
        const myFunc = finesseAttackModifierFactory({
            characterSheet: cs,
            equipmentSheet: {},
            featSheet: fs,
            statusSheet: {},
            weapon: dagger,
        })

        const beforeFeat = myFunc()
        assert.equal(beforeFeat, 3)

        addFeat({
            characterSheet: cs,
            featSheet: fs,
        }, {
            key: 'featFinesseWeaponFighting'
        })

        const afterFeat = myFunc()
        assert.equal(afterFeat - beforeFeat, 1)
    })
})