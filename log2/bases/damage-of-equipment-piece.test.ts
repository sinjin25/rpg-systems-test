import { describe, test, expect } from 'vitest'
import damageOfEquipmentPiece from './damage-of-equipment-piece'
import { Weapon } from '../../equipment-sheet'
import { longSword } from '../../defaults/equipment'
import { setSeed, clearSeed } from '../../roll'
import { BaseEquipment } from '../types'
import newModNode, { findNodeMatching, leaf } from '..'
import { createDefaultOwner } from '../../actor2'

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

    test('is a leaf - the roll is a value, not something explained by children', () => {
        const node = damageOfEquipmentPiece(weapon(8))(owner)
        expect(node.children.length).toEqual(0)
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
