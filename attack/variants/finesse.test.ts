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
        assert.equal(result.total, 2)
    })
    test('works with arbitrary sheets', () => {
        const myFunc = finesseAttackModifierFactory({
            characterSheet: {
                con: 0,
                dex: 0,
                str: 0,
                level: 1,
            },
            equipmentSheet: {},
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: dagger,
        })

        const result = myFunc()
        assert.equal(result.total, -5)
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
        assert.equal(beforeFeat.total, 3)

        addFeat({
            characterSheet: cs,
            featSheet: fs,
        }, {
            key: 'featFinesseWeaponFighting'
        })

        const afterFeat = myFunc()
        assert.equal(afterFeat.total - beforeFeat.total, 1)
    })
})