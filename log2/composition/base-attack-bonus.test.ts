import { describe, test, expect, assert } from 'vitest'
import baseAttackBonus from './base-attack-bonus'
import { createDefaultOwner } from '../../actor2'
import { ClassKeys, ClassLevelPickLog } from '../../class-level2/types'
import modNodeToText from '../format'
import { findNodeMatching } from '..'

// n levels of a single class, no picks
const dip = (key: ClassKeys, n: number): ClassLevelPickLog =>
    Array.from({ length: n }, () => ({ key, freeFeats: [] }))

describe('base-attack-bonus', () => {
    test('one leaf per class (fighter 4, rogue 2), summed to +5', () => {
        const owner = createDefaultOwner({
            cs: { levels: [...dip('fighter', 4), ...dip('rogue', 2)] },
        })
        const node = baseAttackBonus(owner)
        // fighter [1,1,1,1] = 4, rogue [0,1] = 1
        expect(node.total()).toBe(5)
        expect(node.displayName).toBe('base-attack-bonus')

        const f0 = findNodeMatching(node, /fighter/)
        assert.exists(f0)
        assert.equal(f0.total(), 4)
        const f1 = findNodeMatching(node, /rogue/)
        assert.exists(f1)
        assert.equal(f1.total(), 1)
        console.log(modNodeToText(node))
    })

    test('an empty class sheet contributes 0', () => {
        const owner = createDefaultOwner({ cs: { levels: [] } })
        expect(baseAttackBonus(owner).total()).toBe(0)
        expect(baseAttackBonus(owner).children).toEqual([])
    })
})
