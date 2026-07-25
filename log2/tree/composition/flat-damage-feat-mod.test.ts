import { describe, test, expect } from 'vitest'
import flatDamageFeatMod from './flat-damage-feat-mod'
import { createDefaultOwner } from '../../defaults'
import { FeatMaximal } from '../types'
import { leaf, findNodeMatching } from '../..'

const flat = (amount: number): FeatMaximal => ({
    displayName: 'test-flat',
    broadContexts: { 'flat-damage-feat-mod': () => leaf('test-flat', amount) },
})

describe('flat-damage-feat-mod', () => {
    test('is 0 with no contributing feats', () => {
        expect(flatDamageFeatMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing feat and surfaces its leaf', () => {
        const node = flatDamageFeatMod(createDefaultOwner({ fs: { a: flat(4) } }))
        expect(node.total()).toBe(4)
        expect(findNodeMatching(node, /test-flat/i)).toBeTruthy()
    })
})
