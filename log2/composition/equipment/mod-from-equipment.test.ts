import roll from '../../../roll/index.ts'
import { createDefaultOwner } from '../../../actor2'
import newModNode, { findNodeMatching } from '../../index.ts'
import { describe, test, assert, expect } from 'vitest'
import { OwnerLog2 } from '../../types.ts'
import modFromEquipment from './mod-from-equipment.ts'
import { BaseEquipment } from '../../../equipment-sheet2/types.ts'
import { SLOT_TYPE } from '../../../equipment-sheet2/defaults.ts'

const testeq = {
    displayName: 'shortsword',
    acceptableSlots: SLOT_TYPE.weapon,
    broadContexts: {
        'damage': (owner: OwnerLog2) => {
            return newModNode('shortsword', [], () => 6)
        },
        'attack-equipment-mod': (o: OwnerLog2) => {
            return newModNode('enhancement', [], () => 1)
        }
    }
}

const owner = createDefaultOwner({
    es: {
        mainhand: testeq
    }
})

describe('mod-from-equipment', () => {
    test('Can get base damage from eq', () => {
        const node = modFromEquipment('damage')(owner)
        assert.equal(node.total(), 6)
    })
    test('Can get anything else off an eq', () => {
        const node = modFromEquipment('attack-equipment-mod')(owner)
        assert.equal(node.total(), 1)
    })
})

describe('mod-from-equipment cs', () => {
    const amulet: BaseEquipment = {
        displayName: 'stat amul',
        acceptableSlots: SLOT_TYPE.amulet,
        broadContexts: {
            'str-from-equipment': () => newModNode('stat amul', [], 4),
            'dex-from-equipment': () => newModNode('stat amul', [], 3),
            'con-from-equipment': () => newModNode('stat amul', [], 2),
        }
    }
    const owner = createDefaultOwner({
        es: {
            amulet,
        }
    })
    test('replaces equipment-modded-str', () => {
        const str = modFromEquipment('str-from-equipment')(owner)
        const dex = modFromEquipment('dex-from-equipment')(owner)
        const con = modFromEquipment('con-from-equipment')(owner)

        assert.equal(str.total(), 4)
        assert.equal(dex.total(), 3)
        assert.equal(con.total(), 2)

        const found = findNodeMatching(str, /str-from/, {
            includeRoot: true,
        })
        assert.exists(found)
    })
})