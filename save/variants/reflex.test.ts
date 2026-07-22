import { characterLevels, getCharacterLevel } from '../../character-sheet/class-level'
import { describe, test, assert } from 'vitest'

import reflexSaveModifierFactory from './reflex.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { featConSaves } from '../../feat/feats/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { util_findModLogGroupItem } from '../../stat-modifier/log/index.ts'
import { RollModifierGroup } from '../../roll-modifier/types.ts'

describe('reflex save', () => {
    test('scales off dexterity', () => {
        const ref = reflexSaveModifierFactory({
            cs: { con: 20, dex: 14, str: 10, levels: characterLevels(1) },
            es: {},
            fs: defaultFeatSheet,
            ss: {},
        })

        // dex 14 -> +2
        assert.equal(ref().total, 2)
    })

    test('Is properly unaffected by feats w/o the right context', () => {
        const ref = reflexSaveModifierFactory({
            cs: { con: 10, dex: 14, str: 10, levels: characterLevels(1) },
            es: {},
            fs: { ...defaultFeatSheet, featConSaves },
            ss: {},
        })

        assert.equal(ref().total, 2)
    })
})

describe('reflex save scales with equipment', () => {
    test.skip('an item that targets dexterity saves adds its bonus', () => {
        // stub
        // we should have the technology for this we just haven't done it
    })

    test('Confirm dynamic mods work with saves', () => {
        const scalingRing = createEquipment({
            displayName: 'scaling ring',
            // bonuses can work off the characterSheet
            mods: { save: { whitelist: ['all'], mod: (data) => data?.cs ? getCharacterLevel(data.cs) : 0 } },
        })

        const ref = reflexSaveModifierFactory({
            cs: { con: 10, dex: 10, str: 10, levels: characterLevels(5) },
            es: { ring: scalingRing },
            fs: defaultFeatSheet,
            ss: {},
        })

        // dex 10 (+0) + ring (level 5) = 5
        assert.equal(ref().total, 5)
    })

    test('Dexterity context is passed and all logs are available.', () => {
        const amulet = createEquipment({
            displayName: 'dex save amulet',
            mods: { save: { whitelist: ['dexterity'], mod: 2 } },
        })
        const ring = createEquipment({
            displayName: 'save ring',
            mods: { save: { whitelist: ['all'], mod: 1 } },
        })
        const armorOfFortSave = createEquipment({
            displayName: 'fort save armor',
            mods: {
                save: { whitelist: ['constitution'], mod: 1 },
            }
        })
        const ref = reflexSaveModifierFactory({
            cs: { con: 10, dex: 14, str: 10, levels: characterLevels(1) },
            es: { amulet, ring, armor: armorOfFortSave, },
            fs: defaultFeatSheet,
            ss: {},
        })

        // dex 14 (+2) + amulet (+2) + ring (+1) = 5
        // constitution save armor does not pass
        const result = ref()
        assert.equal(result.total, 5)
        console.table(result.groups.find(a => a.displayName === 'base mod'))

        const logCases: Array<{ groupName: RollModifierGroup, modDisplayName: string, shouldExist: boolean }> = [
            { groupName: 'base mod', modDisplayName: 'dex', shouldExist: true },
            { groupName: 'equipment mod', modDisplayName: 'dex save amulet', shouldExist: true },
            { groupName: 'equipment mod', modDisplayName: 'save ring', shouldExist: true },
            // lacks proper context tag
            { groupName: 'equipment mod', modDisplayName: 'fort save armor', shouldExist: false },
        ]

        for (const { groupName, modDisplayName, shouldExist } of logCases) {
            const found = util_findModLogGroupItem(result, { groupName, modDisplayName })
            const label = `${groupName} > ${modDisplayName}`
            if (shouldExist) assert.exists(found, `expected ${label} in the log`)
            else assert.notExists(found, `did not expect ${label} in the log`)
        }
    })
})
