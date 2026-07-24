import { describe, test, expect } from 'vitest'
import critScalableDamageFeatMod from './crit-scalable-damage-feat-mod'
import { createDefaultOwner } from '../../defaults'
import { FeatMaximal } from '../types'
import { leaf, findNodeMatching } from '../..'

// LAYER: crit-scalable-damage-feat-mod (aggregator). Collects every feat on owner.fs that declares a
// 'crit-scalable-damage-feat-mod' contribution and sums them. Empty sheet -> no children -> 0.

const scaler = (amount: number): FeatMaximal => ({
    displayName: 'test-scaler',
    broadContexts: { 'crit-scalable-damage-feat-mod': () => leaf('test-scaler', amount) },
})

describe('crit-scalable-damage-feat-mod', () => {
    test('is 0 with no contributing feats', () => {
        expect(critScalableDamageFeatMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing feat and surfaces its leaf', () => {
        const node = critScalableDamageFeatMod(createDefaultOwner({ fs: { a: scaler(4) } }))
        expect(node.total()).toBe(4)
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
    })

    test('ignores a feat that only declares a different bucket', () => {
        const flatOnly: FeatMaximal = {
            displayName: 'flat-only',
            broadContexts: { 'flat-damage-feat-mod': () => leaf('flat-only', 9) },
        }
        expect(critScalableDamageFeatMod(createDefaultOwner({ fs: { flatOnly } })).total()).toBe(0)
    })
})
