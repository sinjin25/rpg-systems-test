import { describe, test, expect, assert } from 'vitest'
import maxDexOfEquipment from './max-dex-of-equipment'
import { createDefaultOwner } from '../../defaults'
import { bandedMail, halfPlate, heavyShield } from '../../../../defaults/equipment'
import { asStatus } from '../../collect-status-contributions'
import flatFooted from '../bases/status/flat-footed'
import modNodeToText from '../../format'

// LAYER: max-dex-of-equipment. The lowest real cap across worn armor. Trusts the
// per-piece leaf; this proves the min, that unlimited pieces drop out, and the
// placeholder for "no real cap".

const TEMP_MAX = 999 // mirrors the placeholder in the source until real "no cap" semantics land

describe('max-dex-of-equipment', () => {
    test('the most restrictive real cap wins', () => {
        // banded mail caps at +1, half plate at 0 -> 0 is the tighter cap
        const owner = createDefaultOwner({ es: { armor: bandedMail, offhand: halfPlate } })
        expect(maxDexOfEquipment(owner).total()).toBe(0)
    })

    test('unlimited pieces (a shield with no cap) drop out of the min', () => {
        const owner = createDefaultOwner({ es: { armor: bandedMail, offhand: heavyShield } })
        expect(maxDexOfEquipment(owner).total()).toBe(1) // banded mail's +1, shield ignored
    })

    test('no armor -> the placeholder max (no cap applied)', () => {
        expect(maxDexOfEquipment(createDefaultOwner({})).total()).toBe(TEMP_MAX)
    })

    test('only-unlimited armor -> the placeholder max', () => {
        const owner = createDefaultOwner({ es: { offhand: heavyShield } })
        expect(maxDexOfEquipment(owner).total()).toBe(TEMP_MAX)
    })
})

describe('Works with flat-footed status', () => {
    test('Flat-footed hijacks and returns 0', () => {
        const owner = createDefaultOwner({
            es: { armor: bandedMail, offhand: heavyShield },
            ss: {
                flatFooted: asStatus(flatFooted)
            }
        })
        const result = maxDexOfEquipment(owner)
        expect(result.total()).toBe(0)

        // still returns the original items
        const containsMail = result.children.find(a => a.displayName === bandedMail.displayName)
        assert.exists(containsMail)
    })
})
