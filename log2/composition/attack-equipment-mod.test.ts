import { describe, test, expect } from 'vitest'
import attackEquipmentMod from './attack-equipment-mod'
import { createDefaultOwner } from '../../actor2'
import { BaseEquipment, OwnerLog2 } from '../types'
import newModNode, { leaf } from '..'
import { collectEquipmentTags } from './equipment/mod-from-equipment'

const dagger: BaseEquipment = {
    displayName: 'dagger',
    tags: ['finesse'],
    broadContexts: {
    }
}
const daggerPlusOne: BaseEquipment = {
    displayName: 'dagger plus one',
    tags: ['finesse'],
    broadContexts: {
        "attack-from-equipment": () => newModNode('dagger plus one', [], 1)
    }
}

// test that tags can work
const ringPlusOneFinesseAttack: BaseEquipment = {
    displayName: 'ring plus one finesse attack',
    broadContexts: {
        'attack-from-equipment': (o: OwnerLog2) => collectEquipmentTags(o).includes('finesse') ? leaf('ring plus one finesse attack', 1) : undefined
    }
}

describe('attack-equipment-mod', () => {
    test('a weapon enhancement becomes a summed child leaf', () => {
        const node = attackEquipmentMod(createDefaultOwner({ es: { mainhand: daggerPlusOne } }))
        expect(node.total()).toBe(1) // +1 dagger enhancement (whitelist 'all')
    })

    test('worn non-weapon gear contributes, filtered by the weapon tags', () => {
        const withFinesse = attackEquipmentMod(createDefaultOwner({
            es: { mainhand: dagger, ring: ringPlusOneFinesseAttack },
        }))
        expect(withFinesse.total()).toBe(1)

        const withoutFinesse = attackEquipmentMod(createDefaultOwner({
            es: { ring: ringPlusOneFinesseAttack },
        }))
        expect(withoutFinesse.total()).toBe(0)
    })

    test('enhancement and worn gear stack as separate child leaves', () => {
        const node = attackEquipmentMod(createDefaultOwner({
            es: { mainhand: daggerPlusOne, ring: ringPlusOneFinesseAttack },
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
