import { describe, test, expect } from 'vitest'
import damageTakenFeatMod from './damage-taken-feat-mod'
import { createDefaultOwner } from '../defaults'
import { FeatMaximal } from '../types'
import { leaf, findNodeMatching } from '..'

describe('damage-taken-feat-mod', () => {
    test('is 0 with no contributing feats', () => {
        expect(damageTakenFeatMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing feat and surfaces its leaf', () => {
        const dr: FeatMaximal = {
            displayName: 'test-dr',
            broadContexts: { 'damage-taken-feat-mod': () => leaf('test-dr', -2) },
        }
        const node = damageTakenFeatMod(createDefaultOwner({ fs: { dr } }))
        expect(node.total()).toBe(-2)
        expect(findNodeMatching(node, /test-dr/i)).toBeTruthy()
    })
})
