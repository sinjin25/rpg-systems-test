import { describe, test, expect } from 'vitest'
import baseAc from './base-ac'
import { createDefaultOwner } from '../../actor2'
describe('base-ac', () => {
    test('is always 2, regardless of the owner', () => {
        expect(baseAc(createDefaultOwner({ cs: { dex: 8 } })).total()).toBe(2)
        expect(baseAc(createDefaultOwner({ cs: { dex: 20 } })).total()).toBe(2)
    })
})
