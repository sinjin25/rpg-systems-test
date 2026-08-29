import { describe, test, expect, assert } from 'vitest'
import acOfEquipmentPiece from './ac-of-equipment-piece'
import { armors, heavyShield, SLOT_TYPE } from '../../equipment-sheet2/defaults'
import { findNodeMatching } from '..'
import modNodeToText from '../format'
import { createDefaultOwner } from '../../actor2'

describe('ac-of-equipment-piece', () => {
    const owner = createDefaultOwner({
        es: {
            armor: armors['banded mail'],
            offhand: heavyShield,
        }
    })
    test('Returns a node where relevant', () => {
        const node = acOfEquipmentPiece(owner.es.armor!)(owner)
        assert.exists(node)
        assert.equal(node.total(), 7)

        const node2 = acOfEquipmentPiece(owner.es.offhand!)(owner)
        assert.exists(node2)
        assert.equal(node2.total(), 2)
    })

    test('Returns undefined when no relevant broadContext', () => {
        const node = acOfEquipmentPiece({
            displayName: 'shortsword',
            acceptableSlots: SLOT_TYPE.weapon,
            broadContexts: {},
        })(owner)
        assert.notExists(node)
    })
})
