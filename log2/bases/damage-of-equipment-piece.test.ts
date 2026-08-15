import { describe, test, expect, assert } from 'vitest'
import damageOfEquipmentPiece from './damage-of-equipment-piece'
import { shortsword } from '../../equipment-sheet2/defaults'
import { setSeed, clearSeed } from '../../roll'
import { BaseEquipment } from '../../equipment-sheet2/types'
import newModNode, { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../../actor2'
import modNodeToText from '../format'

const owner = createDefaultOwner()
const weapon = (damage: number): BaseEquipment =>
({
    displayName: 'test', contexts: [], broadContexts: {
        damage: () => newModNode('test', [], damage),
    }
} as BaseEquipment)

describe('damage-of-equipment-piece', () => {
    test('reports the weapon\'s rolled damage', () => {
        expect(
            damageOfEquipmentPiece(weapon(8))(owner).total()
        ).toBe(8)
    })

    test('carries the weapon\'s display name', () => {
        const node = damageOfEquipmentPiece(weapon(8))(owner)
        findNodeMatching(node, /test/, {
            includeRoot: true,
        })
    })

    test('exposes the roll + sides via children', () => {
        const node = damageOfEquipmentPiece(shortsword)(owner)
        const rollNode = findNodeMatching(node, 'roll-total', { includeRoot: true })
        assert.exists(rollNode)
        const sidesNode = findNodeMatching(node, /1d6/)
        assert.exists(sidesNode)
    })

    test('Stays stable across reads', () => {
        setSeed(42)
        try {
            const node = damageOfEquipmentPiece(weapon(8))(owner)
            const first = node.total()
            expect(first).toBeGreaterThanOrEqual(1)
            expect(first).toBeLessThanOrEqual(8)
            expect(node.total()).toBe(first)
        } finally {
            clearSeed()
        }
    })
})
