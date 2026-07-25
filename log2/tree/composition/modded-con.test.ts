import { describe, test, expect } from 'vitest'
import moddedCon from './modded-con'
import { createDefaultOwner } from '../../defaults'

// LAYER: modded-con = halfToZero(raw-con + con-from-status + equipment-modded-con). No con-affecting
// content exists yet, so this proves the raw score->modifier conversion and owns the rounding tests.
// Mirrors modded-dex.
describe('modded-con', () => {
    test('converts the raw score to a modifier', () => {
        expect(moddedCon(createDefaultOwner({ cs: { con: 14 } })).total()).toBe(2)
        expect(moddedCon(createDefaultOwner({ cs: { con: 10 } })).total()).toBe(0)
    })

    test('rounds toward zero: odd scores round down, negatives round toward zero', () => {
        const conMod = (con: number) => moddedCon(createDefaultOwner({ cs: { con } })).total()
        expect(conMod(15)).toBe(2)         // 2.5 -> 2
        expect(conMod(9) === 0).toBe(true) // -0.5 rounds toward zero (-0, which === 0)
        expect(conMod(8)).toBe(-1)
        expect(conMod(7)).toBe(-1)         // -1.5 -> -1, not -2
    })
})
