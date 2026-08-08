import featContribution from '../../log2/composition/feat-contribution.ts'
import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2/index.ts'
import armorTraining from './armor-training.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Works', () => {
    test('Found in max-dex-of-equipment', () => {
        const owner = createDefaultOwner({
            fs: {
                armorTraining,
            }
        })
        const maxDexFeatModTree = featContribution('max-dex-feat-mod')(owner)
        const found = findNodeMatching(maxDexFeatModTree, /training/i)
        assert.exists(found)
        expect(found.total()).toEqual(1)
    })
})