import { describe, test, assert } from 'vitest'
import { applyDamage } from './apply-damage'

describe('applyDamage', () => {
    test('reduces curr by the amount', () => {
        const health = { curr: 10, max: 20, temporary: 0 }
        applyDamage(health, 3)
        assert.equal(health.curr, 7)
    })

    test('clamps at 0', () => {
        const health = { curr: 5, max: 20, temporary: 0 }
        applyDamage(health, 50)
        assert.equal(health.curr, 0)
    })

    // regression for #56: a negative damage roll (low STR / debuffs) must deal 0,
    // not heal the target as the old signed convention did
    test('a non-positive amount deals 0 and never heals', () => {
        const health = { curr: 10, max: 20, temporary: 0 }
        applyDamage(health, -5)
        assert.equal(health.curr, 10)
        applyDamage(health, 0)
        assert.equal(health.curr, 10)
    })
})

describe('applyDamage temporary health interactions', () => {
    test('takes from temp health first', () => {
        const health = { curr: 15, max: 20, temporary: 21 }
        const expected: Array<{ input: number, output: number }> = [
            { input: 5, output: 16 },
            { input: 5, output: 11 },
            { input: 5, output: 6 },
            { input: 5, output: 1 },
        ]
        for (let t of expected) {
            applyDamage(health, t.input)
            assert.equal(health.temporary, t.output)
            // should never change while temp absorbs the whole hit
            assert.equal(health.curr, 15)
        }

        // applies partial deduction correctly once temp is exhausted
        applyDamage(health, 5)
        assert.equal(health.temporary, 0)
        assert.equal(health.curr, 11)
    })
})
