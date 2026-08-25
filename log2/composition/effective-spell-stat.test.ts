import { createDefaultOwner } from '../../actor2/index.ts'
import modNodeToText from '../format.ts'
import { findNodeMatching } from '../index.ts'
import effectiveSpellStat from './effective-spell-dc-stat.ts'
import { describe, test, assert, expect } from 'vitest'

describe('effective-spell-stat', () => {
    test('', () => {
        const owner = createDefaultOwner()
        const ess = effectiveSpellStat(owner)

        const f0 = findNodeMatching(ess, /effective-spell-dc-stat/, {
            includeRoot: true,
        })
        const f1 = findNodeMatching(ess, /modded-int/)

        assert.exists(f0)
        assert.exists(f1)

        assert.equal(f1.total(), 15) // 15
        assert.equal(f0.total(), 2) // 15 -> +2
    })
})