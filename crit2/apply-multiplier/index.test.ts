import { describe, test, assert } from 'vitest'
import { applyCritMultiplier } from './index.ts'

describe('applyCritMultiplier', () => {
    test('multiplies the raw roll by the multiplier when there are no mods', () => {
        const result = applyCritMultiplier(4, 0, 0, 2)
        assert.equal(result.total, 8)
        assert.equal(result.scaledPortion, 8)
        assert.equal(result.flatPortion, 0)
    })

    test('scaled mods are multiplied alongside the raw roll', () => {
        // e.g. a +2 enhancement bonus stacked onto a x2 weapon
        const result = applyCritMultiplier(4, 2, 0, 2)
        assert.equal(result.total, 12)
    })

    test("flat mods (e.g. Power Attack) are added after multiplication, not before", () => {
        // 4 base damage * x2 = 8, plus a flat +4 power attack bonus that never scales
        const result = applyCritMultiplier(4, 0, 4, 2)
        assert.equal(result.total, 12)
        assert.equal(result.scaledPortion, 8)
        assert.equal(result.flatPortion, 4)
    })

    test('rounds fractional totals down (e.g. the default x1.5 multiplier)', () => {
        const result = applyCritMultiplier(5, 0, 0, 1.5)
        assert.equal(result.scaledPortion, 7.5)
        assert.equal(result.total, 7)
    })
})
