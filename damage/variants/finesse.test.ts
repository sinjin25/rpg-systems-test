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
        assert.equal(result.total, 2)
    })
    test('works with arbitrary sheets', () => {
        const myFunc = finesseDamageModifierFactory({
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
        const myFunc = finesseDamageModifierFactory({
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
            key: 'featMeleeWeaponFighting'
        })

        const afterFeat = myFunc()
        assert.equal(afterFeat.total - beforeFeat.total, 1)

        // the feat shows up by name in the feat mod group
        const featGroup = afterFeat.groups.find(g => g.displayName === 'feat mod')!
        assert.deepEqual(featGroup.entries, [
            { displayName: fs.featMeleeWeaponFighting!.displayName, amount: 1 },
        ])
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
        assert.equal(result.total, 4)

        // the player-facing group-by breakdown
        assert.deepEqual(result.groups.map(g => g.displayName), ['base mod', 'feat mod', 'equipment mod'])

        const baseGroup = result.groups.find(g => g.displayName === 'base mod')!
        assert.deepEqual(baseGroup.entries, [{ displayName: 'dex', amount: 3 }])

        const equipGroup = result.groups.find(g => g.displayName === 'equipment mod')!
        assert.deepEqual(equipGroup.entries, [
            { displayName: RingPlusOneFinesseAttack.displayName, amount: 1 },
        ])
    })
})
