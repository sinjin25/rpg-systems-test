import { describe, test, assert } from 'vitest'
import { saveSucceeds } from './save-succeeds'

describe('saveSucceeds', () => {
    test('a total equal to the dc succeeds', () => {
        assert.isTrue(saveSucceeds(15, 15))
    })

    test('a total below the dc fails', () => {
        assert.isFalse(saveSucceeds(14, 15))
    })

    test('a total above the dc succeeds', () => {
        assert.isTrue(saveSucceeds(20, 5))
    })

    test('a natural 20 always succeeds, even against an unbeatable dc', () => {
        assert.isTrue(saveSucceeds(3, 999, 20))
    })

    test('a natural 1 always fails, even against a dc of 0', () => {
        assert.isFalse(saveSucceeds(21, 0, 1))
    })
})
