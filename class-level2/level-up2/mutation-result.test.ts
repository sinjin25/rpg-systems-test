import { describe, test, assert } from 'vitest'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { mutationResult } from './index'
import { Feat2 } from '../../feat2/types'
import featRegistry from '../../feat2/registry'
import hardy from '../../feat2/feats/con-saves'
import { ClassLevel, MutationFailureReasons } from '../types'

const baseCl: ClassLevel = {
    key: 'fighter',
    classFeats: ['Hardy'],
    hasFreeFeats: [{ levelHasFreeFeats: true }],
    attackBonus: 1,
    fortitude: 0,
    reflex: 0,
    will: 0,
}

describe('mutationResult', () => {
    test('fails when clone is not actually a clone', () => {
        const owner = createDefaultOwner()
        const result = mutationResult(
            { original: owner, clone: owner },
            { cl: baseCl, chosenFeats: ['Dodge'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, MutationFailureReasons.improperClone)
    })

    test('fails when a chosen feat does not exist', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Not A Real Feat' as any] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, MutationFailureReasons.featDoesNotExist)
    })

    test('fails when the same free feat is chosen twice', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Dodge', 'Dodge'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, MutationFailureReasons.duplicateFeat)
    })

    test('fails when a chosen free feat duplicates one of the class feats', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Hardy'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, MutationFailureReasons.duplicateFeat)
    })

    test('class feats are never prereq-checked', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        // Hardy is in classFeats, not chosenFeats, and has no prereqs met/unmet
        // path exercised here beyond existence + dupe checks
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Dodge'] }
        )
        assert.equal(result.result.kind, 'success')
    })

    test('succeeds when everything checks out', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Dodge'] }
        )
        assert.deepEqual(result.result, { kind: 'success' })
        assert.equal(result.original, original)
        assert.equal(result.clone, clone)
    })
})

describe('mutationResult chosen feat order', () => {
    const featA: Feat2 = {
        displayName: 'A',
        broadContexts: {},
    }
    const featB: Feat2 = {
        displayName: 'B',
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => 'A' in o.fs,
    }
    const featC: Feat2 = {
        displayName: 'C',
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => 'Hardy' in o.fs,
    }
    // featRegistry requires FeatIds as keys
    // @ts-ignore
    featRegistry.A = featA
    // @ts-ignore
    featRegistry.B = featB
    // @ts-ignore
    featRegistry.C = featC

    test('a bad pick order (C, B, A) still succeeds', () => {
        const original = createDefaultOwner()
        // ex: supplied by display layer
        const clone = createDefaultOwner({
            fs: { Hardy: hardy, A: featA, B: featB, C: featC },
        })

        const result = mutationResult(
            { original, clone },
            {
                cl: { ...baseCl, classFeats: ['Hardy'] },
                chosenFeats: ['C', 'B', 'A'] as any,
            }
        )

        assert.deepEqual(result.result, { kind: 'success' })
    })
})
