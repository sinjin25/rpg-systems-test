import { describe, test, expect } from 'vitest'
import damage from './damage'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal } from '../types'
import { Weapon } from '../../../equipment-sheet'
import { longSword, daggerPlusOne, leatherArmor } from '../../../defaults/equipment'
import { setSeed, clearSeed } from '../../../roll'
import { findNodeMatching } from '../..'
import modNodeToText from '../../format'

const weapon = (dmg: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => dmg } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('damage (terminal)', () => {
    test('sums its two buckets: crit-scalable-damage + flat-damage', () => {
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
        const owner = withSlot(
            createDefaultOwner({ cs: { dex: 18, str: 10 }, es: { mainhand: daggerPlusOne } }),
            weapon(8),
        )
        const node = damage(owner)

        expect(node.total()).toBe(12)
        expect(findNodeMatching(node, /modded-dex/i)).toBeTruthy()
        expect(findNodeMatching(node, /effective-damage-stat/i)?.total()).toBe(4)
        console.log(modNodeToText(node))
    })

    test('a real longsword\'s roll is frozen, so the total is stable across reads', () => {
        setSeed(42)
        try {
            const node = damage(withSlot(createDefaultOwner({}), longSword))
            const first = node.total()
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
        expect(() => damage(withSlot(createDefaultOwner({}), leatherArmor))).toThrow(/relevantSlot/)
    })
})
