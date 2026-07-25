import { describe, test, expect } from 'vitest'
import damage from './damage'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal } from '../types'
import { Weapon } from '../../../../equipment-sheet'
import { longSword, daggerPlusOne, leatherArmor } from '../../../../defaults/equipment'
import { setSeed, clearSeed } from '../../../../roll'
import { findNodeMatching } from '../..'
import modNodeToText from '../../format'

// LAYER: damage (terminal). Sums two buckets - crit-scalable-damage (weapon roll +
// effective stat + scaling mods) and flat-damage (mods that never scale). The
// same two sub-problems crit-damage multiplies/adds; here they are just summed.
// Each has its own suite, so this proves the assembly: that both buckets are
// wired in and land in the total, that the die comes from relevantSlot while the
// stat comes from the mainhand, and that a missing/invalid relevantSlot is rejected.

// a weapon whose damage is fixed, so the sum is exact without touching the RNG
const weapon = (dmg: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => dmg } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('damage (terminal)', () => {
    test('sums its two buckets: crit-scalable-damage + flat-damage', () => {
        // default character is melee (str) -> +2; fixed weapon deals 8; no flat mods
        const node = damage(withSlot(createDefaultOwner({}), weapon(8)))
        expect(node.total()).toBe(10) // (8 damage + 2 str) scalable + 0 flat
        expect(node.children.length).toBe(2)
        expect(findNodeMatching(node, /crit-scalable-damage/i)).toBeTruthy()
        expect(findNodeMatching(node, /flat-damage/i)).toBeTruthy()
    })

    test('total is exactly the sum of its children (trusts them)', () => {
        const node = damage(withSlot(createDefaultOwner({}), weapon(8)))
        const childSum = node.children.reduce((acc, c) => acc + c.total(), 0)
        expect(node.total()).toBe(childSum)
    })

    test('the die comes from relevantSlot, the stat from the mainhand', () => {
        // finesse dagger in the mainhand routes the stat to dex (18 -> +4);
        // the relevantSlot weapon (fixed 8) drives the die independently
        const owner = withSlot(
            createDefaultOwner({ cs: { dex: 18, str: 10 }, es: { mainhand: daggerPlusOne } }),
            weapon(8),
        )
        const node = damage(owner)

        expect(node.total()).toBe(12) // 8 damage + 4 dex (dex wins on the finesse dagger)
        expect(findNodeMatching(node, /modded-dex/i)).toBeTruthy()
        expect(findNodeMatching(node, /effective-damage-stat/i)?.total()).toBe(4)
        console.log(modNodeToText(node))
    })

    test('a real longsword\'s roll is frozen, so the total is stable across reads', () => {
        setSeed(42)
        try {
            const node = damage(withSlot(createDefaultOwner({}), longSword))
            const first = node.total()
            // longsword d8 (1..8) + default str +2
            expect(first).toBeGreaterThanOrEqual(1 + 2)
            expect(first).toBeLessThanOrEqual(8 + 2)
            expect(node.total()).toBe(first)
        } finally {
            clearSeed()
        }
    })

    test('throws when no relevantSlot is provided', () => {
        expect(() => damage(createDefaultOwner({}))).toThrow(/relevantSlot/)
    })

    test('throws when relevantSlot is not a weapon', () => {
        // leather armor has no damage() - it is not a weapon
        expect(() => damage(withSlot(createDefaultOwner({}), leatherArmor))).toThrow(/relevantSlot/)
    })
})
