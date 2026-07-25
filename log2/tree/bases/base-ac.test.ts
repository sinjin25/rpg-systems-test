import { describe, test, expect } from 'vitest'
import baseAc from './base-ac'
import { createDefaultOwner } from '../../defaults'

// LAYER: base-ac (a leaf). The flat 10 every character starts from.

describe('base-ac', () => {
    test('is always 10, regardless of the owner', () => {
        expect(baseAc(createDefaultOwner({ cs: { dex: 8 } })).total()).toBe(10)
        expect(baseAc(createDefaultOwner({ cs: { dex: 20 } })).total()).toBe(10)
    })
})
