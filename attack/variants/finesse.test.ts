import { default as finesseAttackModifierFactory } from './finesse'
import { describe, test, assert, expect } from 'vitest'
import { CharacterSheet, defaultCharacterSheet } from '../../character-sheet'
import { addFeat, defaultFeatSheet, FeatSheet } from '../../feat'
import { dagger } from '../../defaults/equipment'
import { defaultEquipmentSheet } from '../../equipment-sheet'

describe('factory works', () => {
    test('default character sheet', () => {
        const myFunc = finesseAttackModifierFactory({
            characterSheet: defaultCharacterSheet,
            equipmentSheet: defaultEquipmentSheet,
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
            equipmentSheet: defaultEquipmentSheet,
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