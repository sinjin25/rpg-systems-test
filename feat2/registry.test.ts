import { describe, test, assert, expect } from 'vitest'
import registry, { deriveFeatKey, featMartialProficiency } from './registry'

describe('deriveFeatKey', () => {
    test('returns a literal in the editor', () => {
        const funcRequiresLiteral = (str: 'Martial Proficiency') => str

        const martialKey = deriveFeatKey(featMartialProficiency)

        const shouldNotTsError = funcRequiresLiteral(martialKey)
        assert.equal(shouldNotTsError, featMartialProficiency.displayName)
    })
})

describe('registry', () => {
    test('Behavior', () => {
        const mwp = registry['Martial Proficiency']
        assert.exists(mwp)

        const funcRequiresLiteral = (str: 'Martial Proficiency') => str

        // registry provides the actual object
        funcRequiresLiteral(mwp.displayName)

        // is a pointer
        assert.equal(mwp, featMartialProficiency)
    })
})