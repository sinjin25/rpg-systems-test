import { describe, test, expect } from 'vitest'
import attackEquipmentMod from './attack-equipment-mod'
import { createDefaultOwner } from '../../defaults'
import { dagger, daggerPlusOne, RingPlusOneFinesseAttack } from '../../../defaults/equipment'

describe('attack-equipment-mod', () => {
    test('a weapon enhancement becomes a summed child leaf', () => {
        const node = attackEquipmentMod(createDefaultOwner({ es: { mainhand: daggerPlusOne } }))
        expect(node.total()).toBe(1) // +1 dagger enhancement (whitelist 'all')
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['enhancement +1 1'])
    })

    test('worn non-weapon gear contributes, filtered by the weapon tags', () => {
        const withFinesse = attackEquipmentMod(createDefaultOwner({
            es: { mainhand: dagger, ring: RingPlusOneFinesseAttack },
        }))
        expect(withFinesse.total()).toBe(1)

        // default shortsword (melee, no finesse tag) -> the ring does not apply
        const withoutFinesse = attackEquipmentMod(createDefaultOwner({
            es: { ring: RingPlusOneFinesseAttack },
        }))
        expect(withoutFinesse.total()).toBe(0)
    })

    test('enhancement and worn gear stack as separate child leaves', () => {
        const node = attackEquipmentMod(createDefaultOwner({
            es: { mainhand: daggerPlusOne, ring: RingPlusOneFinesseAttack },
        }))
        expect(node.total()).toBe(2) // enhancement +1 and the finesse ring +1
        expect(node.children.length).toBe(2)
    })

    test('plain gear with no attack contexts -> 0, no children', () => {
        const node = attackEquipmentMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
