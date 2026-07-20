import { describe, test, assert, expect } from 'vitest'
import { featArmorTraining } from './armor-training.ts'
import calculateFeatMod from '../../roll-modifier/feat-mod.ts'
import calculateAc from '../../stat-modifier/ac/index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { fullPlate } from '../../defaults/equipment/index.ts'
import { Armor, equipmentIsArmor } from '../../equipment-sheet/index.ts'

describe('featArmorTraining (maxDex broadContext)', () => {
    const fs = { featArmorTraining }

    test('maxDex broad context works', () => {
        const data = { cs: defaultCharacterSheet, fs, es: {} }

        const maxDex = calculateFeatMod(data, [], 'maxDex')
        assert.equal(maxDex.total, 1)
        assert.equal(maxDex.entries[0].displayName, 'Armor Training')
        assert.equal(maxDex.entries[0].amount, 1)

        // the feat only lives in the maxDex broadContext, so unrelated contexts see nothing
        assert.equal(calculateFeatMod(data, [], 'ac').total, 0)
        assert.equal(calculateFeatMod(data, [], 'attack').total, 0)
    })

    test('Integration: calculateAc', () => {
        const cs = { ...defaultCharacterSheet, dex: 16 } // +3

        if (equipmentIsArmor(fullPlate)) {
            expect(fullPlate).toMatchObject({
                maxDexBonus: 0,
                contexts: ['heavyArmor'],
                ac: 9
            })

            // receives no dex modifier bonus
            const withoutFeat = calculateAc({ cs, es: { armor: fullPlate }, fs: {}, ss: {} })
            assert.equal(withoutFeat.total, 19) // 10 base + 0 dex + 9 armor

            // armor training raises max dex bonus by 1 to +1 max
            const withFeat = calculateAc({ cs, es: { armor: fullPlate }, fs, ss: {} })
            assert.equal(withFeat.total, 20) // 10 base + 1 dex + 9 armor
        } else {
            throw Error('expected fullPlate to be an Armor type')
        }
    })
})
