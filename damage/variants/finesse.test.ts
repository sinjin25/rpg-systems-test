import { default as finesseDamageModifierFactory } from './finesse'
import { describe, test, assert, expect } from 'vitest'
import { CharacterSheet, defaultCharacterSheet } from '../../character-sheet'
import { addFeat, defaultFeatSheet, FeatSheet } from '../../feat'
import { dagger, RingPlusOneFinesseAttack } from '../../defaults/equipment'
import { defaultEquipmentSheet, EquipmentSheet } from '../../equipment-sheet'
import { util_findRollModifierGroupItem } from '../../roll-modifier/types'

describe('factory works', () => {
    test('default character sheet', () => {
        const myFunc = finesseDamageModifierFactory({
            cs: defaultCharacterSheet,
            es: defaultEquipmentSheet,
            fs: defaultFeatSheet,
            ss: {},
            weapon: dagger,
        })

        const result = myFunc()
        assert.equal(result.total, 2)
    })
    test('works with arbitrary sheets', () => {
        const myFunc = finesseDamageModifierFactory({
            cs: {
                con: 0,
                dex: 0,
                str: 0,
                level: 1,
            },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
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
            cs,
            es: defaultEquipmentSheet,
            fs,
            ss: {},
            weapon: dagger,
        })

        const beforeFeat = myFunc()
        assert.equal(beforeFeat.total, 3)

        addFeat({
            cs,
            fs,
        }, {
            key: 'featMeleeWeaponFighting'
        })

        const afterFeat = myFunc()
        assert.equal(afterFeat.total - beforeFeat.total, 1)

        // the feat shows up by name in the feat mod group
        const featMod = util_findRollModifierGroupItem(afterFeat, {
            groupName: 'feat mod',
            modDisplayName: fs.featMeleeWeaponFighting!.displayName,
        })
        assert.exists(featMod)
        assert.equal(featMod.amount, 1)
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
            cs,
            es,
            fs: defaultFeatSheet,
            ss: {},
            weapon: dagger,
        })

        // bm(3) + em(1, ring applies via finesse context)
        const result = myFunc()
        assert.equal(result.total, 4)

        // the player-facing group-by breakdown
        assert.deepEqual(result.groups.map(g => g.displayName), ['base mod', 'feat mod', 'equipment mod', 'status mod'])

        const baseGroup = result.groups.find(g => g.displayName === 'base mod')!
        assert.deepEqual(baseGroup.entries, [{ displayName: 'dex', amount: 3 }])

        const equipMod = util_findRollModifierGroupItem(result, {
            groupName: 'equipment mod',
            modDisplayName: RingPlusOneFinesseAttack.displayName,
        })
        assert.exists(equipMod)
        assert.equal(equipMod.amount, 1)
    })
})
