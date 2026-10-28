import { describe, test, expect, assert } from 'vitest'
import { createDefaultOwner } from '../../actor2'
import { _verifyOwnerIsClone } from './clone'

describe('_verifyOwnerIsClone', () => {
    test('Catches a spread syntax error', () => {
        const o = createDefaultOwner({})

        assert.equal(
            _verifyOwnerIsClone({
                clone: { ...o },
                original: o,
            }),
            false
        )
    })
    test('Catches wrapper equality', () => {
        const o = createDefaultOwner({})

        assert.equal(
            _verifyOwnerIsClone({
                clone: o,
                original: o,
            }),
            false
        )
    })
})