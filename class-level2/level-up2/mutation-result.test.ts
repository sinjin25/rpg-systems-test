import { describe, test, assert, vi } from 'vitest'
import { createDefaultOwner } from '../../actor2'
import { mutationResult } from './index'
import { ClassLevel } from '../types'

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
        assert.equal((result.result as any).reason, 'improper clone provided')
    })

    test('fails when a chosen feat does not exist', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Not A Real Feat' as any] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, 'feat does not exist')
    })

    test('fails when the same free feat is chosen twice', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Dodge', 'Dodge'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, 'duplicate feat chosen')
    })

    test('fails when a chosen free feat duplicates one of the class feats', () => {
        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResult(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Hardy'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, 'duplicate feat chosen')
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

describe('mutationResult prereqs', () => {
    test('fails when a chosen free feat prereq is not met on the clone', async () => {
        vi.resetModules()
        vi.doMock('../../feat2/registry', async () => {
            const actual = await vi.importActual<typeof import('../../feat2/registry')>('../../feat2/registry')
            return {
                ...actual,
                default: {
                    ...actual.default,
                    Dodge: {
                        ...actual.default.Dodge,
                        prerequisites: () => false,
                    },
                },
            }
        })

        const { mutationResult: mutationResultWithMock } = await import('./index')

        const original = createDefaultOwner()
        const clone = createDefaultOwner()
        const result = mutationResultWithMock(
            { original, clone },
            { cl: baseCl, chosenFeats: ['Dodge'] }
        )
        assert.equal(result.result.kind, 'failure')
        assert.equal((result.result as any).reason, 'feat requirement not met')

        vi.doUnmock('../../feat2/registry')
        vi.resetModules()
    })
})
