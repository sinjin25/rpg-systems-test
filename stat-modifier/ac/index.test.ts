import { describe, test, assert } from 'vitest'
import { calculateAc } from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTwoDex, leatherArmor } from '../../defaults/equipment/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { featDodgy } from '../../feat/feats/index.ts'
import { ModLogMember } from '../log/index.ts'

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

        assert.deepEqual(log.groups.map(g => g.displayName), ['base ac', 'dexterity', 'armor', 'feats', 'equipment'])

        const armorGroup = log.groups.find(g => g.displayName === 'armor')!
        assert.deepEqual(armorGroup.entries, [
            { displayName: leatherArmor.displayName, amount: 2 },
        ])

        const dexGroup = log.groups.find(g => g.displayName === 'dexterity')!
        assert.deepEqual((dexGroup.entries[0] as ModLogMember).detail, [
            { displayName: RingPlusTwoDex.displayName, amount: 2 },
        ])

        assert.equal(log.finalResult().total, total)
    })
})
