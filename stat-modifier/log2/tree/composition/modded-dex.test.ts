import { describe, test, expect } from 'vitest'
import moddedDex from './modded-dex'
import catsGrace from '../bases/status/cats-grace'
import { createDefaultOwner } from '../../../../defaults'
import { asStatus } from '../../collect-status-contributions'

// LAYER: modded-dex = raw-dex + dex-from-status. Trusts both children (each has its own suite);
// this only proves the two are added together. dex-from-status now reads owner.ss, so the status
// contribution is present only when the status is actually on the sheet.

describe('modded-dex', () => {
    test('adds the raw dex modifier to the status contribution', () => {
        const withStatus = (dex: number) =>
            createDefaultOwner({ cs: { dex }, ss: { catsGrace: asStatus(catsGrace) } })
        expect(moddedDex(withStatus(14)).total()).toBe(6) // +2 raw + 4 status
        expect(moddedDex(withStatus(10)).total()).toBe(4) // +0 raw + 4 status
    })

    test('with no statuses, modded-dex is just the raw modifier', () => {
        expect(moddedDex(createDefaultOwner({ cs: { dex: 14 } })).total()).toBe(2)
        expect(moddedDex(createDefaultOwner({ cs: { dex: 10 } })).total()).toBe(0)
    })
})
