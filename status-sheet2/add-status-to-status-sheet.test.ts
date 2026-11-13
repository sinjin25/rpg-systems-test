import { describe, test, assert, expect } from 'vitest'
import { getStatusKey } from './add-status-to-status-sheet'
import dodge from '../feat2/feats/dodge'
import { equal } from 'node:assert'

describe('getStatusKey', () => {
    test('works', () => {
        const str = getStatusKey(dodge)
        assert.equal(str, dodge.id)
    })
    test('generic applies', () => {
        // string literal 'dodge'
        const str = getStatusKey(dodge)

        // intellisense gives you an error ('dodge' === 'abc') not string === 'abc'
        // @ts-expect-error
        assert.isNotTrue(str === 'abc')
    })
})