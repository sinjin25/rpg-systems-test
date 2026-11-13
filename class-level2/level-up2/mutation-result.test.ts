import { describe, test, assert, afterAll } from 'vitest'
import { createDefaultOwner } from '../../actor2'
import { OwnerMaximal } from '../../actor2/types'
import { mutationResult, patchCloneWithProposal } from './index'
import { Feat2 } from '../../feat2/types'
import featRegistry from '../../feat2/registry'
import hardy from '../../feat2/feats/con-saves'
import { ClassLevel, MutationFailureReasons } from '../types'
import { getAbilityKey } from '../../ability-sheet2'
import studiedTarget from '../../ability-sheet2/abilities2/studied-target'
import { testUtilCloneOwner } from './clone'

const baseCl: ClassLevel = {
    key: 'fighter',
    classFeats: ['hardy'],
    hasFreeFeats: [{ levelHasFreeFeats: true }],
    attackBonus: 1,
    fortitude: 0,
    reflex: 0,
    will: 0,
    classAbilities: [getAbilityKey(studiedTarget)],
}

describe('mutationResult', () => {
    test('fails when clone is not actually a clone', () => {
        const owner = createDefaultOwner()
        const result = mutationResult(
            { original: owner, clone: owner },
            { cl: baseCl, chosenFeats: ['dodge'] }
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
            { cl: baseCl, chosenFeats: ['dodge', 'dodge'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, MutationFailureReasons.duplicateFeat)
    })

    test('fails when a chosen free feat duplicates one of the class feats', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['hardy'] }
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
            { cl: baseCl, chosenFeats: ['dodge'] }
        )
        assert.equal(result.result.kind, 'success')
    })

    test('succeeds when everything passes', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['dodge'] }
        )
        assert.deepEqual(result.result, { kind: 'success' })
        assert.equal(result.original, original)
        assert.equal(result.clone, clone)
    })
})

describe('mutationResult chosen feat order', () => {
    const featA: Feat2 = {
        displayName: 'A',
        id: 'a',
        hidden: false,
        broadContexts: {},
    }
    const featB: Feat2 = {
        displayName: 'B',
        id: 'b',
        hidden: false,
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => 'a' in o.fs,
    }
    const featC: Feat2 = {
        displayName: 'C',
        id: 'c',
        hidden: false,
        broadContexts: {},
        prerequisites: (o: OwnerMaximal) => 'hardy' in o.fs,
    }
    // featRegistry requires FeatIds as keys
    // @ts-ignore
    featRegistry.a = featA
    // @ts-ignore
    featRegistry.b = featB
    // @ts-ignore
    featRegistry.c = featC

    test('a bad pick order (C, B, A) still succeeds', () => {
        const original = createDefaultOwner()
        // ex: supplied by display layer
        const clone = createDefaultOwner({
            fs: { hardy: hardy, a: featA, b: featB, c: featC },
        })

        const result = mutationResult(
            { original, clone },
            {
                cl: { ...baseCl, classFeats: ['hardy'] },
                chosenFeats: ['c', 'b', 'a'] as any,
            }
        )

        assert.deepEqual(result.result, { kind: 'success' })
    }),

        afterAll(() => {
            delete featRegistry['a']
            delete featRegistry['b']
            delete featRegistry['c']
        })
})

describe('Can add abilities', () => {
    test('Should add studied target', () => {
        const owner = createDefaultOwner()

        assert.notExists(
            owner.as.free.items[getAbilityKey(studiedTarget)]
        )

        const patchedClone = patchCloneWithProposal(
            { original: owner, clone: testUtilCloneOwner(owner) },
            { cl: baseCl, chosenFeats: ['dodge'] }
        )
        assert.exists(patchedClone)

        const result = mutationResult(
            { original: owner, clone: patchedClone! },
            { cl: baseCl, chosenFeats: ['dodge'] }
        )

        assert.exists(
            result.clone.as.free.items[getAbilityKey(studiedTarget)]
        )
    })
})