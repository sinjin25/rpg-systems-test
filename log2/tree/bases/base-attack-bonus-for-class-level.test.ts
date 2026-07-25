import { describe, test, expect } from 'vitest'
import baseAttackBonusForClassLevel from './base-attack-bonus-for-class-level'
import { ClassLevels, ClassLevelMember } from '../../../../character-sheet/class-level/type'

// LAYER: base-attack-bonus-for-class-level (a leaf). One class -> its name + a single summed number.
// Trusts class-level's acquired-levels clamping; this proves the sum and that unacquired levels are
// excluded.

const member = (attackBonus: number): ClassLevelMember => ({
    attackBonus, fortitudeSave: 0, reflexSave: 0, feats: {},
})

// a class whose data grants +1 BAB per level, with `taken` of its `levels` actually acquired
const bab = (displayName: string, levels: number, taken = levels): ClassLevels => ({
    displayName,
    level: taken,
    data: Array.from({ length: levels }, () => member(1)),
})

describe('base-attack-bonus-for-class-level', () => {
    test('names the class and sums its acquired per-level attack bonuses', () => {
        const node = baseAttackBonusForClassLevel(bab('Fighter', 4))
        expect(node.displayName).toBe('Fighter')
        expect(node.total()).toBe(4)
    })

    test('only levels actually acquired count (2 of 4 taken -> +2)', () => {
        expect(baseAttackBonusForClassLevel(bab('Slayer', 4, 2)).total()).toBe(2)
    })
})
