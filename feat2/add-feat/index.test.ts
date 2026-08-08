import { createDefaultOwner, OwnerMaximal } from '../../actor2/index.ts'
import { Feat2 } from '../index.ts'
import addFeat from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Works with a test feat', () => {
    const ArequiresB: Feat2 = {
        displayName: 'A',
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => {
            if ('B' in o.fs) return true
            return false
        }
    }
    const CrequiresDF: Feat2 = {
        displayName: 'C',
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => {
            if ('D' in o.fs && 'F' in o.fs) return true
            return false
        }
    }

    const B: Feat2 = {
        displayName: 'B',
        broadContexts: {},
    }

    const D: Feat2 = {
        displayName: 'D',
        broadContexts: {},
    }

    const F: Feat2 = {
        displayName: 'F',
        broadContexts: {},
    }

    const G: Feat2 = {
        displayName: 'G',
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => {
            if (o.cs.str >= 16) return true
            return false
        }
    }

    test('Works with one requirement', () => {
        const owner = createDefaultOwner()
        assert.notExists(owner.fs['A'])
        const result = addFeat(owner, ArequiresB)
        assert.equal(result, false)
        assert.notExists(owner.fs['A'])

        addFeat(owner, B)
        const result2 = addFeat(owner, ArequiresB)
        assert.equal(result2, true)
    })

    test('Works with multiple requirement', () => {
        const owner = createDefaultOwner()
        const result = addFeat(owner, CrequiresDF)
        assert.equal(result, false)

        addFeat(owner, D)
        addFeat(owner, F)
        const result2 = addFeat(owner, CrequiresDF)
        assert.equal(result2, true)
    })

    test('Works with character sheet requirements', () => {
        const owner = createDefaultOwner()
        const result = addFeat(owner, G)
        assert.equal(result, false)

        const owner2 = createDefaultOwner({
            cs: {
                str: 16,
            }
        })

        const result2 = addFeat(owner2, G)
        assert.equal(result2, true)
    })
})

describe('add-feat past bug fixes', () => {
    test('addFeat properly doesnt add feats where prereqs are not met', () => {
        const ArequiresB: Feat2 = {
            displayName: 'A',
            broadContexts: {},
            prerequisites: (o: OwnerMaximal) => {
                if ('B' in o.fs) return true
                return false
            }
        }

        const owner = createDefaultOwner()
        assert.notExists(owner.fs['A'])
        const result = addFeat(owner, ArequiresB)
        assert.equal(result, false)
    })
})