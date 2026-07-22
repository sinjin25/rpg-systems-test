import { describe, test, expect } from 'vitest'
import newRawStr from './raw-str'
import { createDefaultOwner } from '../../../../defaults'

// LAYER: raw-str (a leaf). It reads owner.cs.str and reports the raw SCORE unchanged.
// The stat->modifier rounding now lives one layer up in modded-str (which sums every str
// source in score space first), so it is tested exhaustively there, not here.

const rawStr = (str: number) => newRawStr(createDefaultOwner({ cs: { str } })).total()

describe('raw-str', () => {
    test('reports the raw str score, not a modifier', () => {
        expect(rawStr(10)).toBe(10)
        expect(rawStr(14)).toBe(14)
        expect(rawStr(7)).toBe(7)
    })
})
