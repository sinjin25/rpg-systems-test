import { describe, test, assert } from 'vitest'
import { applyHealthDelta } from './apply-delta'

describe('applyHealthDelta', () => {
    test('applies a mid-range delta exactly', () => {
        const health = { curr: 10, max: 20, temporary: 0 }
        applyHealthDelta(health, 3)
        assert.equal(health.curr, 13)
    })

    test('damage clamps at 0', () => {
        const health = { curr: 5, max: 20, temporary: 0 }
        applyHealthDelta(health, -50)
        assert.equal(health.curr, 0)
    })

    test('heal clamps at max', () => {
        const health = { curr: 18, max: 20, temporary: 0 }
        applyHealthDelta(health, 50)
        assert.equal(health.curr, 20)
    })
})

describe('applyHealthDelta temporary health interactions', () => {
    test('Applies to temp health first', () => {
        const health = { curr: 15, max: 20, temporary: 21 }
        const expected: Array<{
            input: number,
            output: number
        }> = [
                { input: -5, output: 16 },
                { input: -5, output: 11 },
                { input: -5, output: 6 },
                { input: -5, output: 1 },
            ]
        for (let t of expected) {
            applyHealthDelta(health, t.input)
            assert.equal(health.temporary, t.output)
            // should never change
            assert.equal(health.curr, 15)
        }

        // applies partial deduction correctly
        applyHealthDelta(health, -5)
        assert.equal(health.temporary, 0)
        assert.equal(health.curr, 11)
    })
})