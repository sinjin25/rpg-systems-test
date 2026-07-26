import { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../defaults'
import featContribution from './feat-contribution.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Works', () => {
    test('gives a warning for invalid keys but fails gracefully', () => {
        const owner = createDefaultOwner()
        // @ts-expect-error
        const node = featContribution('safasdf')(owner)

        assert.equal(node.total(), 0)
        assert.exists(findNodeMatching(node, /safasdf/i, {
            includeRoot: true,
        }))
    })
    test('For initiative', () => {
        const owner = createDefaultOwner({
            fs: {
                'improved-initiative': {
                    displayName: 'improved-initiative1',
                    broadContexts: {
                        'initiative-feat-mod': () => leaf('improved-initiative1', 4)
                    }
                },
                'improved-initiative2': {
                    displayName: 'improved-initiative2',
                    broadContexts: {
                        'initiative-feat-mod': () => leaf('improved-initiative2', 4)
                    }
                }
            }
        })

        const node = featContribution('initiative-feat-mod')(owner)
        assert.equal(node.total(), 8)

        assert.exists(findNodeMatching(node, /initiative-feat-mod/i, {
            includeRoot: true,
        }))
        assert.exists(findNodeMatching(node, /ive1/i))
        assert.exists(findNodeMatching(node, /ive2/i))
    })
})