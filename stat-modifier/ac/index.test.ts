import { describe, test, assert } from 'vitest'
import { calculateAc } from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTwoDex, leatherArmor } from '../../defaults/equipment/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { featDodgy } from '../../feat/feats/index.ts'
import { util_findModLogGroupItem } from '../log/index.ts'
import { flatFootedStatus } from '../../status-sheet/statuses/flat-footed.ts'

describe('calculateAc', () => {
    test('ac derives from dex', () => {
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc.total, 10)

        const calc2 = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 16 }, es: {}, fs: {}, ss: {}
        })
        assert.equal(calc2.total, 13)
    })

    test('flat-footed cancels the dex bonus', () => {
        const ss = { flatFooted: flatFootedStatus(10) }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 16 }, es: {}, fs: {}, ss
        })
        // dex 16 grants +3 normally (see 'ac derives from dex'); flat-footed cancels it
        assert.equal(calc.total, 10)
    })

    test('dex factors in equipment', () => {
        const es = { ring: RingPlusTwoDex }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es, fs: {}, ss: {}
        })
        assert.equal(calc.total, 11)
    })

    test('armor adds a flat ac bonus', () => {
        const es = { armor: leatherArmor }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es, fs: {}, ss: {}
        })
        assert.equal(calc.total, 12)
    })

    test('feats can give flat ac bonuses', () => {
        const fs = { featDodgy }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: {}, fs, ss: {}
        })
        assert.equal(calc.total, 14)
    })

    test('equipment can give flat ac bonuses via mods', () => {
        const acRing = createEquipment({
            displayName: 'ring of protection',
            contexts: [],
            mods: {
                ac: { whitelist: ['all'], mod: 1 },
            },
        })
        const es = { ring: acRing }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es, fs: {}, ss: {}
        })
        assert.equal(calc.total, 11)
    })

    test('log records the ac sources per group', () => {
        const { log, total } = calculateAc({
            cs: defaultCharacterSheet,
            es: { ring: RingPlusTwoDex, armor: leatherArmor },
            fs: { featDodgy },
            ss: {},
        })

        assert.deepEqual(log.groups.map(g => g.displayName), ['base ac', 'dexterity', 'armor', 'feats', 'equipment', 'statuses'])

        const armorMod = util_findModLogGroupItem(log, {
            groupName: 'armor',
            modDisplayName: leatherArmor.displayName,
        })
        assert.exists(armorMod)
        assert.equal(armorMod.amount, 2)

        const dexMod = util_findModLogGroupItem(log, {
            groupName: 'dexterity',
            modDisplayName: 'dex modifier',
        })!
        assert.deepEqual(dexMod.detail, [
            { displayName: RingPlusTwoDex.displayName, amount: 2 },
        ])

        assert.equal(log.finalResult().total, total)
    })
})
