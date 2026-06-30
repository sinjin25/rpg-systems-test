import index from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('basemod', () => {
    test('works', () => {
        assert.equal(index(10), 0)
        assert.equal(index(6), -2)
        assert.equal(index(12), 1)
    })
    test('negative works in favor of user', () => {
        assert.equal(
            index(-1),
            (index(0))
        )
        assert.equal(
            index(-6),
            index(-7),
        )
    })
    test('positive works against user', () => {
        assert.equal(
            index(15),
            index(14),
        )
        assert.equal(
            index(16),
            index(17),
        )
    })
})