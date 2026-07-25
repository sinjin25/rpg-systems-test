import { describe, test, expect } from 'vitest'
import flatDamage from './flat-damage'
import { createDefaultOwner } from '../../defaults'
import { FeatMaximal } from '../types'
import { leaf, findNodeMatching } from '../..'

describe('flat-damage', () => {
    test('is 0 with no flat sources', () => {
        expect(flatDamage(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a flat feat mod', () => {
        const powerAttack: FeatMaximal = {
            displayName: 'power-attack',
            broadContexts: { 'flat-damage-feat-mod': () => leaf('power-attack', 6) },
        }
        const node = flatDamage(createDefaultOwner({ fs: { powerAttack } }))
        expect(node.total()).toBe(6)
        expect(findNodeMatching(node, /power-attack/i)).toBeTruthy()
    })
})
