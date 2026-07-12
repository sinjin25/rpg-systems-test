import { describe, test, assert } from 'vitest'
import { default as isThreat } from './index.ts'

describe('isThreat', () => {
    test('roll below threat range is not a threat', () => {
        assert.equal(isThreat(18, 19), false)
    })

    test('roll equal to, higher than, or a nat 20 is a threat', () => {
        assert.equal(isThreat(19, 18), true)
        assert.equal(isThreat(19, 19), true)
        assert.equal(isThreat(20, 20), true)
    })
})
