import { describe, test, expect } from 'vitest'
import moddedDex from './modded-dex'
import catsGrace from '../bases/status/cats-grace'
import { createDefaultOwner } from '../../defaults'
import { dexAmulet } from './equipment/demo-equips'

// LAYER: modded-dex = halfToZero(raw-dex + dex-from-status + equipment-modded-dex). Every source
// is summed in SCORE space first, then converted to a modifier once. Trusts each child (each has
// its own suite); this proves they are summed before the conversion, and owns the rounding tests.
// dex-from-status now reads owner.ss, so the status contribution is present only when the status
// is actually on the sheet.

describe('modded-dex', () => {
    test('sums the status score bonus before converting to a modifier', () => {
        const withStatus = (dex: number) =>
            createDefaultOwner({ cs: { dex }, ss: { catsGrace } })
        expect(moddedDex(withStatus(14)).total()).toBe(4) // (14 + 4) -> +4
        expect(moddedDex(withStatus(10)).total()).toBe(2) // (10 + 4) -> +2
    })

    test('with no statuses, modded-dex is just the raw score converted to a modifier', () => {
        expect(moddedDex(createDefaultOwner({ cs: { dex: 14 } })).total()).toBe(2)
        expect(moddedDex(createDefaultOwner({ cs: { dex: 10 } })).total()).toBe(0)
    })

    // the stat->modifier rounding lives here now (raw-dex just reports the score)
    test('rounds toward zero: odd scores round down, negatives round toward zero', () => {
        const dexMod = (dex: number) => moddedDex(createDefaultOwner({ cs: { dex } })).total()
        expect(dexMod(15)).toBe(2)       // mod 5 -> 2.5 -> 2
        expect(dexMod(9) === 0).toBe(true) // -0.5 rounds toward zero (-0, which === 0)
        expect(dexMod(8)).toBe(-1)
        expect(dexMod(7)).toBe(-1)       // -1.5 -> -1, not -2
    })

    test('Can factor in equipment (using EquipmentMaximal type', () => {
        // THIS WILL RESULT IN TYPE ERRORS BECAUSE OWNER DOESN'T BELIEVE IT'S USING EQUIPMENT MAXIMAL TYPE
        const owner = createDefaultOwner({
            cs: { dex: 16 },
            es: {
                // @ts-expect-error
                amulet: dexAmulet // EquipmentMaximal
            },
        })

        const result = moddedDex(owner)
        expect(result.total()).toBe(4) // (16 + 2) -> +4
    })
})
