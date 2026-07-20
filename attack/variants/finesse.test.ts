import { characterLevels, getCharacterLevel } from '../../character-sheet/class-level'
import { default as finesseAttackModifierFactory } from './finesse'
import { describe, test, assert, expect } from 'vitest'
import { CharacterSheet, defaultCharacterSheet } from '../../character-sheet'
import { addFeat, defaultFeatSheet, FeatSheet } from '../../feat'
import { dagger } from '../../defaults/equipment'
import { defaultEquipmentSheet, Weapon } from '../../equipment-sheet'
import { createDefaultOwner } from '../../defaults'
import { commitLevelUp } from '../../character/level-up'
import { util_findRollModifierGroupItem } from '../../roll-modifier/types'

describe('factory works', () => {
    test('default character sheet', () => {
        const myFunc = finesseAttackModifierFactory({
            cs: defaultCharacterSheet,
            es: defaultEquipmentSheet,
            fs: defaultFeatSheet,
            ss: {},
            weapon: dagger as Weapon,
        })

        const result = myFunc()
        assert.equal(result.total, 2)
    })
    test('works with arbitrary sheets', () => {
        const myFunc = finesseAttackModifierFactory({
            cs: {
                con: 0,
                dex: 0,
                str: 0,
                levels: characterLevels(1),
            },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
            weapon: dagger as Weapon,
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
            cs,
            es: defaultEquipmentSheet,
            fs,
            ss: {},
            weapon: dagger as Weapon,
        })

        const beforeFeat = myFunc()
        assert.equal(beforeFeat.total, 3)

        addFeat({
            cs,
            fs,
        }, {
            key: 'featFinesseWeaponFighting'
        })

        const afterFeat = myFunc()
        assert.equal(afterFeat.total - beforeFeat.total, 1)
    })
    test('works with class levels (BAB)', () => {
        const BAB_DISPLAY = 'base attack bonus'
        const fighter = createDefaultOwner({
            cs: { ...defaultCharacterSheet, str: 16, dex: 14, levels: {} },
        })
        commitLevelUp(fighter, { className: 'fighter', bonusFeat: 'featDodgy' }) // L1

        {
            const myFunc = finesseAttackModifierFactory({
                ...fighter,
                weapon: dagger as Weapon,
            })
            const result = myFunc()
            const bab = result.groups.find(a => a.displayName === BAB_DISPLAY)
            assert.exists(bab)
            assert.equal(bab.total, 1)
        }

        commitLevelUp(fighter, { className: 'fighter' }) // L2

        {
            const myFunc = finesseAttackModifierFactory({
                ...fighter,
                weapon: dagger as Weapon,
            })
            const result = myFunc()
            const bab = result.groups.find(a => a.displayName === BAB_DISPLAY)
            assert.exists(bab)
            assert.equal(bab.total, 2)
        }
    })
})