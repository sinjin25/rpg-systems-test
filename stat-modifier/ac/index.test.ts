import { describe, test, assert, expect } from 'vitest'
import { calculateAc } from './index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { RingPlusTwoDex, leatherArmor, shield, heavyShield, fullPlate, bandedMail } from '../../defaults/equipment/index.ts'
import { createEquipment } from '../../equipment-sheet/create-equipment.ts'
import { featDodgy, featArmorTraining, featShieldMastery, featHeavyArmorMastery } from '../../feat/feats/index.ts'
import { util_findModLogGroupItem } from '../log/index.ts'
import { flatFootedStatus } from '../../status-sheet/statuses/flat-footed.ts'
import { equipmentIsArmor } from '../../equipment-sheet/index.ts'

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

    test('a heavy-armor feat triggers only for heavy armor, not other armor types', () => {
        const fs = { featHeavyArmorMastery }

        // full plate carries the 'heavyArmor' context -> the feat applies
        const heavy = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: { armor: fullPlate }, fs, ss: {}
        })
        const mod = util_findModLogGroupItem(heavy.log, {
            groupName: 'feats',
            modDisplayName: 'Heavy Armor Mastery',
        })
        assert.exists(mod)
        assert.equal(mod!.amount, 1)
        // 10 base + 0 dex (capped) + 9 full plate + 1 heavy armor mastery
        assert.equal(heavy.total, 20)

        // leather armor is a different type ('lightArmor') -> the feat does not apply
        const light = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: { armor: leatherArmor }, fs, ss: {}
        })
        assert.notExists(util_findModLogGroupItem(light.log, {
            groupName: 'feats',
            modDisplayName: 'Heavy Armor Mastery',
        }))
        // 10 base + 0 dex + 2 leather, no feat bonus
        assert.equal(light.total, 12)
    })
})

describe('calculateAc shields', () => {
    test('Shields can increase AC', () => {
        const es = { offhand: shield }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es, fs: {}, ss: {}
        })
        // 10 base + 0 dex + 1 buckler
        assert.equal(calc.total, 11)
    })

    test('Multiple armor items (.ac) are applied correctly', () => {
        const es = { armor: leatherArmor, offhand: heavyShield }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es, fs: {}, ss: {}
        })
        // 10 base + 0 dex + 2 leather + 2 heavy shield
        assert.equal(calc.total, 14)
    })

    test('a shield-context feat grants ac only while a shield is equipped', () => {
        const fs = { featShieldMastery }

        // shield equipped -> the 'shield' context is active, so the feat applies
        const withShield = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: { offhand: shield }, fs, ss: {}
        })
        const mod = util_findModLogGroupItem(withShield.log, {
            groupName: 'feats',
            modDisplayName: 'Shield Mastery',
        })
        assert.exists(mod)
        assert.equal(mod!.amount, 1)
        // 10 base + 0 dex + 1 buckler ac + 1 shield mastery
        assert.equal(withShield.total, 12)

        // no shield -> the 'shield' context is absent, so the feat does not apply
        const withoutShield = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: {}, fs, ss: {}
        })
        assert.notExists(util_findModLogGroupItem(withoutShield.log, {
            groupName: 'feats',
            modDisplayName: 'Shield Mastery',
        }))
        assert.equal(withoutShield.total, 10)
    })
})

describe('calculateAC MaxDex', () => {
    test('Armor max dex caps dex contribution', () => {
        const BASE_AC = 10
        const cs = { ...defaultCharacterSheet, dex: 300 + 10 } // 10 is a +0 mod

        const unarmored = calculateAc({ cs, es: {}, fs: {}, ss: {} })
        assert.equal(unarmored.total, BASE_AC + 150)

        const plated = calculateAc({ cs, es: { armor: fullPlate }, fs: {}, ss: {} })
        if (!equipmentIsArmor(fullPlate)) throw Error('Expected an Armor type')
        expect(fullPlate).toMatchObject({
            maxDexBonus: 0,
            ac: 9,
        })
        assert.equal(plated.total, 19)
    })

    test('Boundary: maximum dex mod for armor', () => {
        const es = { armor: bandedMail } // maxDexBonus 1, ac 7
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 12 }, es, fs: {}, ss: {} // +1, under the cap
        })
        // dex min(1, 1) = 1: 10 + 1 + 7
        assert.equal(calc.total, 18)
    })

    test('maxDex can be modified through the maxDex BroadContext', () => {
        const cs = { ...defaultCharacterSheet, dex: 16 } // +3
        const fs = { featArmorTraining } // maxDex +1

        const capped = calculateAc({ cs, es: { armor: fullPlate }, fs, ss: {} })
        // full plate base 0 + armor training 1 = allowance 1; dex min(3, 1) = 1: 10 + 1 + 9
        assert.equal(capped.total, 20)

        // gate holds: with no capping armor worn, the feat does nothing to AC
        const unarmored = calculateAc({ cs, es: {}, fs, ss: {} })
        assert.equal(unarmored.total, 13) // 10 + 3
        /* console.table(capped.log.groups.find(a => a.displayName === 'dexterity').entries[0].detail) */
    })
})

describe('calculateAc logs', () => {
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
