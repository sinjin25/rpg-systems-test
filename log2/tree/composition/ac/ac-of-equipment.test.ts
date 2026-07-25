import { describe, test, expect } from 'vitest'
import acOfEquipment from './ac-of-equipment'
import { createDefaultOwner } from '../../../defaults'
import { bandedMail, heavyShield } from '../../../../../defaults/equipment'

// LAYER: ac-of-equipment. Sums the flat AC of every worn armor piece. Trusts the
// per-piece leaf; this proves the pieces are collected and summed, and that a
// shield (which carries an `ac` but no dex cap) counts as an armor piece here.

describe('ac-of-equipment', () => {
    test('sums every armor piece, shields included', () => {
        const owner = createDefaultOwner({ es: { armor: bandedMail, offhand: heavyShield } })
        expect(acOfEquipment(owner).total()).toBe(9) // banded mail 7 + heavy shield 2
    })

    test('no armor is 0', () => {
        // default mainhand is a weapon, not armor, so this owner wears nothing
        expect(acOfEquipment(createDefaultOwner({})).total()).toBe(0)
    })
})
