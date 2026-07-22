import { describe, test, expect } from 'vitest'
import newRawDex from './raw-dex'
import { createDefaultOwner } from '../../../../defaults'

// LAYER: raw-dex (a leaf). It reads owner.cs.dex and reports the raw SCORE unchanged.
// The stat->modifier rounding now lives one layer up in modded-dex (which sums every dex
// source in score space first), so it is tested exhaustively there, not here.

const rawDex = (dex: number) => newRawDex(createDefaultOwner({ cs: { dex } })).total()

describe('raw-dex', () => {
    test('reports the raw dex score, not a modifier', () => {
        expect(rawDex(10)).toBe(10)
        expect(rawDex(14)).toBe(14)
        expect(rawDex(7)).toBe(7)
    })
})
