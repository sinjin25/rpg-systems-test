import { describe, test, expect } from 'vitest'
import newRawDex from './raw-dex'
import { createDefaultOwner } from '../../../../defaults'

// LAYER: raw-dex (a leaf). It reads owner.cs.dex and folds it into a modifier.
// Nothing below it - this is where the stat->modifier rounding lives, so it is
// tested exhaustively here and trusted everywhere upstream.

const dexMod = (dex: number) => newRawDex(createDefaultOwner({ cs: { dex } })).total()

describe('raw-dex', () => {
    test('10 is +0, every 2 points is +1', () => {
        expect(dexMod(10)).toBe(0)
        expect(dexMod(14)).toBe(2)
    })

    test('odd scores round down toward the lower modifier', () => {
        expect(dexMod(15)).toBe(2) // mod 5 -> 2.5 -> 2
    })

    test('negatives round toward zero, not down', () => {
        expect(dexMod(9) === 0).toBe(true) // -0.5 rounds toward zero (-0, which === 0)
        expect(dexMod(8)).toBe(-1)
        expect(dexMod(7)).toBe(-1) // -1.5 -> -1, not -2
    })
})
