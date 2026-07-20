import { describe, test, assert } from 'vitest'
import { applyHeal } from './apply-heal'

describe('applyHeal', () => {
    test('restores curr by the amount', () => {
        const health = { curr: 10, max: 20, temporary: 0 }
        applyHeal(health, 3)
        assert.equal(health.curr, 13)
    })

    test('clamps at max', () => {
        const health = { curr: 18, max: 20, temporary: 0 }
        applyHeal(health, 50)
        assert.equal(health.curr, 20)
    })

    test('a non-positive amount heals 0', () => {
        const health = { curr: 10, max: 20, temporary: 0 }
        applyHeal(health, -5)
        assert.equal(health.curr, 10)
    })

    test('does not add to temporary health', () => {
        const health = { curr: 10, max: 20, temporary: 3 }
        applyHeal(health, 5)
        assert.equal(health.curr, 15)
        assert.equal(health.temporary, 3)
    })
})
