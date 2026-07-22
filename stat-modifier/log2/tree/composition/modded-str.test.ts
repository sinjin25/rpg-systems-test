import { describe, test, expect } from 'vitest'
import moddedStr from './modded-str'
import bullsStrength from '../bases/status/bulls-strength'
import { createDefaultOwner } from '../../../../defaults'
import { asStatus } from '../../collect-status-contributions'

// LAYER: modded-str = raw-str + str-from-status. Trusts both children (each has its own suite);
// this only proves the two are added together. str-from-status reads owner.ss, so the status
// contribution is present only when the status is actually on the sheet.

describe('modded-str', () => {
    test('adds the raw str modifier to the status contribution', () => {
        const withStatus = (str: number) =>
            createDefaultOwner({ cs: { str }, ss: { bullsStrength: asStatus(bullsStrength) } })
        expect(moddedStr(withStatus(14)).total()).toBe(6) // +2 raw + 4 status
        expect(moddedStr(withStatus(10)).total()).toBe(4) // +0 raw + 4 status
    })

    test('with no statuses, modded-str is just the raw modifier', () => {
        expect(moddedStr(createDefaultOwner({ cs: { str: 14 } })).total()).toBe(2)
        expect(moddedStr(createDefaultOwner({ cs: { str: 10 } })).total()).toBe(0)
    })
})
