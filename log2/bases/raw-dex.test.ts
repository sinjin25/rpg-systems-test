import { describe, test, expect } from 'vitest'
import newRawDex from './raw-dex'
import { createDefaultOwner } from '../defaults'

const rawDex = (dex: number) => newRawDex(createDefaultOwner({ cs: { dex } })).total()

describe('raw-dex', () => {
    test('reports the raw dex score, not a modifier', () => {
        expect(rawDex(10)).toBe(10)
        expect(rawDex(14)).toBe(14)
        expect(rawDex(7)).toBe(7)
    })
})
