import { describe, test, expect, assert } from 'vitest'
import damageOfEquipmentPiece from './damage-of-equipment-piece'
import { shortsword, SLOT_TYPE } from '../../equipment-sheet2/defaults'
import { createRoll } from '../../roll'
import { BaseEquipment } from '../../equipment-sheet2/types'
import newModNode, { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../../actor2'
import modNodeToText from '../format'

const owner = createDefaultOwner()
const weapon = (damage: number): BaseEquipment => ({
    displayName: 'test',
    acceptableSlots: SLOT_TYPE.weapon,
    broadContexts: {
        damage: () => newModNode('test', [], damage),
    },
})

describe('damage-of-equipment-piece', () => {
    test('reports the weapon\'s rolled damage', () => {
        expect(
            damageOfEquipmentPiece(weapon(8))(owner).total()
        ).toBe(8)
    })

    test('carries the weapon\'s display name', () => {
        const node = damageOfEquipmentPiece(weapon(8))(owner)
        findNodeMatching(node, /test$/, {
            includeRoot: true,
        })
    })

    test('exposes the roll + sides via children', () => {
        const node = damageOfEquipmentPiece(shortsword)(owner)
        const rollNode = findNodeMatching(node, /roll-total$/, { includeRoot: true })
        assert.exists(rollNode)
        const sidesNode = findNodeMatching(node, /1d6/)
        assert.exists(sidesNode)
    })

    test('Stays stable across reads', () => {
        const node = damageOfEquipmentPiece(weapon(8))(owner, { rollInstance: createRoll(42) })
        const first = node.total()
        expect(first).toBeGreaterThanOrEqual(1)
        expect(first).toBeLessThanOrEqual(8)
        expect(node.total()).toBe(first)
    })
})
