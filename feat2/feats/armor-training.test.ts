import maxDexFeatMod from '../../log2/composition/max-dex-feat-mod.ts'
import { createDefaultOwner } from '../../log2/defaults.ts'
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
        const maxDexFeatModTree = maxDexFeatMod(owner)
        const found = findNodeMatching(maxDexFeatModTree, /training/i)
        assert.exists(found)
        expect(found.total()).toEqual(1)
    })
})