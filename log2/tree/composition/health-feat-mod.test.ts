import { describe, test, expect } from 'vitest'
import { createDefaultOwner } from '../../defaults'
import { FeatMaximal } from '../types'
import { leaf, findNodeMatching } from '../..'
import healthFeatMod from './health-feat-mod'

// LAYER: crit-scalable-damage-feat-mod (aggregator). Collects every feat on owner.fs that declares a
// 'crit-scalable-damage-feat-mod' contribution and sums them. Empty sheet -> no children -> 0.

const scaler = (amount: number): FeatMaximal => ({
    displayName: 'test-scaler',
    broadContexts: { 'health-feat-mod': () => leaf('test-scaler', amount) },
})

describe('health-feat-mod', () => {
    test('is 0 with no contributing feats', () => {
        expect(healthFeatMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing feat and surfaces its leaf', () => {
        const node = healthFeatMod(createDefaultOwner({ fs: { a: scaler(4) } }))
        expect(node.total()).toBe(4)
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
    })
})
