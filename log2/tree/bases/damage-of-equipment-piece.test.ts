import { describe, test, expect } from 'vitest'
import damageOfEquipmentPiece from './damage-of-equipment-piece'
import { Weapon } from '../../../../equipment-sheet'
import { longSword } from '../../../../defaults/equipment'
import { setSeed, clearSeed } from '../../../../roll'

// LAYER: damage-of-equipment-piece (a leaf). One weapon's rolled damage.
// The load-bearing distinction lives here: the roll is resolved ONCE, at
// construction, and frozen. total() must report that same number to every
// caller - a node whose total() rerolled on each read would hand a different
// damage figure to each ancestor that looked at it (see rollNode in
// log2/index.ts). This layer can't use rollNode directly yet because the
// legacy Weapon.damage() isn't a `sides` subtree.

const weapon = (damage: () => number): Weapon =>
    ({ displayName: 'test', contexts: [], damage } as Weapon)

describe('damage-of-equipment-piece', () => {
    test('reports the weapon\'s rolled damage', () => {
        expect(damageOfEquipmentPiece(weapon(() => 8)).total()).toBe(8)
    })

    test('carries the weapon\'s display name', () => {
        const w = ({ displayName: 'longsword', contexts: [], damage: () => 8 } as Weapon)
        expect(damageOfEquipmentPiece(w).displayName).toBe('longsword')
    })

    test('is a leaf - the roll is a value, not something explained by children', () => {
        expect(damageOfEquipmentPiece(weapon(() => 8)).children).toEqual([])
    })

    test('the roll is resolved once and frozen: damage() runs at construction, total() stays put', () => {
        let calls = 0
        // a damage source that would change every time it is read
        const node = damageOfEquipmentPiece(weapon(() => ++calls))

        expect(calls).toBe(1)          // resolved eagerly, at construction
        expect(node.total()).toBe(1)   // and never re-rolled
        expect(node.total()).toBe(1)
        expect(calls).toBe(1)
    })

    test('a real longsword rolls within its die and stays stable across reads', () => {
        setSeed(42)
        try {
            const node = damageOfEquipmentPiece(longSword)
            const first = node.total()
            expect(first).toBeGreaterThanOrEqual(1)
            expect(first).toBeLessThanOrEqual(8)
            expect(node.total()).toBe(first)
        } finally {
            clearSeed()
        }
    })
})
