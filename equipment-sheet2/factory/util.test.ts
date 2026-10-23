import { describe, expect, test } from 'vitest'
import { getModByRank, getModTblBySlot, getModValueByPerfection } from './util'
import { weaponAffixLookupTable } from './tables/weapon'

describe('getModTblBySlot', () => {
    test('returns the matching lookup table for a slot + position + mod', () => {
        expect(getModTblBySlot('mainhand', 'affix', 'attack')).toBe(weaponAffixLookupTable.attack)
    })

    test('returns empty array when the slot has no table for the mod', () => {
        expect(getModTblBySlot('offhand', 'affix', 'attack')).toEqual([])
    })
})

describe('getModByRank', () => {
    test('returns the value at the requested rank', () => {
        expect(getModByRank('mainhand', 'affix', 'attack', 1)).toBe(weaponAffixLookupTable.attack[1])
    })

    test('falls back to the last available rank when the requested rank is too high', () => {
        const attackRanks = weaponAffixLookupTable.attack
        expect(getModByRank('mainhand', 'affix', 'attack', 99)).toBe(attackRanks[attackRanks.length - 1])
    })

    test('returns undefined when there is no data for the slot', () => {
        expect(getModByRank('offhand', 'affix', 'attack', 0)).toBeUndefined()
    })
})

describe('getModValueByPerfection', () => {
    test('returns min at perfection 0 and max at perfection 100', () => {
        const ltv = { min: 2, max: 6, weight: 1 }
        expect(getModValueByPerfection(ltv, 0)).toBe(2)
        expect(getModValueByPerfection(ltv, 100)).toBe(6)
    })

    test('rounds to the nearest integer in between', () => {
        const ltv = { min: 1, max: 2, weight: 1 }
        expect(getModValueByPerfection(ltv, 49)).toBe(1)
        expect(getModValueByPerfection(ltv, 50)).toBe(2)
        expect(getModValueByPerfection(ltv, 51)).toBe(2)
    })
})
