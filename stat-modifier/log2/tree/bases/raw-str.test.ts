import { describe, test, expect } from 'vitest'
import newRawStr from './raw-str'
import { createDefaultOwner } from '../../../../defaults'

// LAYER: raw-str (a leaf). It reads owner.cs.str and folds it into a modifier.
// Nothing below it - this is where the stat->modifier rounding lives, so it is
// tested exhaustively here and trusted everywhere upstream.

const strMod = (str: number) => newRawStr(createDefaultOwner({ cs: { str } })).total()

describe('raw-str', () => {
    test('10 is +0, every 2 points is +1', () => {
        expect(strMod(10)).toBe(0)
        expect(strMod(14)).toBe(2)
    })

    test('odd scores round down toward the lower modifier', () => {
        expect(strMod(15)).toBe(2) // mod 5 -> 2.5 -> 2
    })

    test('negatives round toward zero, not down', () => {
        expect(strMod(9) === 0).toBe(true) // -0.5 rounds toward zero (-0, which === 0)
        expect(strMod(8)).toBe(-1)
        expect(strMod(7)).toBe(-1) // -1.5 -> -1, not -2
    })
})
