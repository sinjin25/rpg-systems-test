import { describe, test, expect } from 'vitest'
import moddedStr from './modded-str'
import bullsStrength from '../bases/status/bulls-strength'
import { createDefaultOwner } from '../../../../defaults'
import { asStatus } from '../../collect-status-contributions'

// LAYER: modded-str = halfToZero(raw-str + str-from-status). Every source is summed in SCORE
// space first, then converted to a modifier once. Trusts both children (each has its own suite);
// this proves they are summed before the conversion, and owns the rounding tests. str-from-status
// reads owner.ss, so the status contribution is present only when the status is on the sheet.

describe('modded-str', () => {
    test('sums the status score bonus before converting to a modifier', () => {
        const withStatus = (str: number) =>
            createDefaultOwner({ cs: { str }, ss: { bullsStrength: asStatus(bullsStrength) } })
        expect(moddedStr(withStatus(14)).total()).toBe(4) // (14 + 4) -> +4
        expect(moddedStr(withStatus(10)).total()).toBe(2) // (10 + 4) -> +2
    })

    test('with no statuses, modded-str is just the raw score converted to a modifier', () => {
        expect(moddedStr(createDefaultOwner({ cs: { str: 14 } })).total()).toBe(2)
        expect(moddedStr(createDefaultOwner({ cs: { str: 10 } })).total()).toBe(0)
    })

    // the stat->modifier rounding lives here now (raw-str just reports the score)
    test('rounds toward zero: odd scores round down, negatives round toward zero', () => {
        const strMod = (str: number) => moddedStr(createDefaultOwner({ cs: { str } })).total()
        expect(strMod(15)).toBe(2)       // mod 5 -> 2.5 -> 2
        expect(strMod(9) === 0).toBe(true) // -0.5 rounds toward zero (-0, which === 0)
        expect(strMod(8)).toBe(-1)
        expect(strMod(7)).toBe(-1)       // -1.5 -> -1, not -2
    })
})
