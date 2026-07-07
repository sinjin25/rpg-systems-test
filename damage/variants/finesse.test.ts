import { default as finesseDamageModifierFactory } from './finesse'
import { describe, test, assert, expect } from 'vitest'
import { CharacterSheet, defaultCharacterSheet } from '../../character-sheet'
import { addFeat, defaultFeatSheet, FeatSheet } from '../../feat'
import { dagger, RingPlusOneFinesseAttack } from '../../defaults/equipment'
import { defaultEquipmentSheet, EquipmentSheet } from '../../equipment-sheet'

describe('factory works', () => {
    test('default character sheet', () => {
        const myFunc = finesseDamageModifierFactory({
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
        const myFunc = finesseDamageModifierFactory({
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
        const myFunc = finesseDamageModifierFactory({
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
            key: 'featMeleeWeaponFighting'
        })

        const afterFeat = myFunc()
        assert.equal(afterFeat - beforeFeat, 1)
    })
    test('works with equipment mods', () => {
        const cs: CharacterSheet = {
            ...defaultCharacterSheet,
            dex: 16,
        }
        const es: EquipmentSheet = {
            ...defaultEquipmentSheet,
            mainhand: dagger,
            ring: RingPlusOneFinesseAttack,
        }
        const myFunc = finesseDamageModifierFactory({
            characterSheet: cs,
            equipmentSheet: es,
            featSheet: defaultFeatSheet,
            statusSheet: {},
            weapon: dagger,
        })

        // bm(3) + em(1, ring applies via finesse context)
        const result = myFunc()
        assert.equal(result, 4)
    })
})
