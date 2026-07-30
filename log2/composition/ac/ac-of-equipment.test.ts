import { describe, test, expect, assert } from 'vitest'
import acOfEquipment from './ac-of-equipment'
import { createDefaultOwner } from '../../defaults'
import { armors, heavyShield } from '../../../equipment-sheet2/defaults'
import { findNodeMatching } from '../..'

describe('ac-of-equipment', () => {
    test('sums every armor piece, shields included', () => {
        const owner = createDefaultOwner({ es: { armor: armors['banded mail'], offhand: heavyShield } })
        const node = acOfEquipment(owner)
        expect(node.total()).toBe(9) // banded mail 7 + heavy shield 2
        const f1 = findNodeMatching(node, /banded mail/)
        const f2 = findNodeMatching(node, /heavy shield/)

        assert.exists(f1)
        assert.exists(f2)
    })

    test('no armor is 0', () => {
        // default mainhand is a weapon, not armor, so this owner wears nothing
        expect(acOfEquipment(createDefaultOwner({})).total()).toBe(0)
    })
})
