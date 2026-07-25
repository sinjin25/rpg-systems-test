import { describe, test, expect } from 'vitest'
import { createDefaultOwner } from '../../defaults'
import { FeatMaximal } from '../types'
import { leaf, findNodeMatching } from '../..'
import initiativeFeatMod from './initiative-feat-mod'

const scaler = (amount: number): FeatMaximal => ({
    displayName: 'test-scaler',
    broadContexts: { 'initiative-feat-mod': () => leaf('test-scaler', amount) },
})

describe('initiative-feat-mod', () => {
    test('is 0 with no contributing feats', () => {
        expect(initiativeFeatMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing feat and surfaces its leaf', () => {
        const node = initiativeFeatMod(createDefaultOwner({ fs: { a: scaler(4) } }))
        expect(node.total()).toBe(4)
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
    })
})
