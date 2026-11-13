import { describe, test, assert, expect } from 'vitest'
import registry, { deriveFeatKey, featMartialProficiency } from './registry'

describe('deriveFeatKey', () => {
    test('returns a literal in the editor', () => {
        const funcRequiresLiteral = (str: 'martialProficiency') => str

        const martialKey = deriveFeatKey(featMartialProficiency)

        const shouldNotTsError = funcRequiresLiteral(martialKey)
        assert.equal(shouldNotTsError, featMartialProficiency.id)
    })
})

describe('registry', () => {
    test('Behavior', () => {
        const mwp = registry['martialProficiency']
        assert.exists(mwp)

        const funcRequiresLiteral = (str: 'martialProficiency') => str

        // registry provides the actual object
        funcRequiresLiteral(mwp.id)

        // is a pointer
        assert.equal(mwp, featMartialProficiency)
    })
})