import { describe, test, expect } from 'vitest'
import critDamage from './crit-damage'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal, FeatMaximal } from '../types'
import { Weapon } from '../../../../equipment-sheet'
import { leatherArmor } from '../../../../defaults/equipment'
import { leaf, findNodeMatching } from '../..'
import modNodeToText from '../../format'

// LAYER: crit-damage (terminal). Assembles floor( multiplier x (weaponRoll + scaledMods) + flatMods )
// out of three sub-problems that each have their own suite: crit-multiplier, crit-scalable-damage, flat-damage.
// So this proves the assembly - the multiplier hits ONLY the scaled bucket, the flat bucket is added
// after, and the single floor at the root matches legacy crit2/apply-multiplier. The four numeric cases
// below are ported directly from crit2/apply-multiplier/index.test.ts.

// a weapon whose damage and crit multiplier are fixed, so totals are exact without touching the RNG
const weapon = (dmg: number, crit?: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => dmg, critMultiplier: crit } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

// str 10 -> +0, so the scaled bucket is exactly (roll + scaledMods), matching legacy's rawRollTotal
const flatStatOwner = (fs: OwnerMaximal['fs'] = {}) =>
    createDefaultOwner({ cs: { str: 10, dex: 10 }, fs })

const scalingFeat = (amount: number): FeatMaximal => ({
    displayName: 'test-scaler',
    broadContexts: { 'crit-scalable-damage-feat-mod': () => leaf('test-scaler', amount) },
})

const flatFeat = (amount: number): FeatMaximal => ({
    displayName: 'test-flat',
    broadContexts: { 'flat-damage-feat-mod': () => leaf('test-flat', amount) },
})

describe('crit-damage (terminal)', () => {
    // ported from crit2/apply-multiplier: applyCritMultiplier(4, 0, 0, 2) === 8
    test('multiplies the roll by the multiplier when there are no mods', () => {
        const node = critDamage(withSlot(flatStatOwner(), weapon(4, 2)))
        expect(node.total()).toBe(8) // 2 * (4 + 0) + 0
    })

    // ported: applyCritMultiplier(4, 2, 0, 2) === 12 - a scaled mod is multiplied alongside the roll
    test('scaled mods are multiplied alongside the roll', () => {
        const node = critDamage(withSlot(flatStatOwner({ scaler: scalingFeat(2) }), weapon(4, 2)))
        expect(node.total()).toBe(12) // 2 * (4 + 2) + 0
    })

    // ported: applyCritMultiplier(4, 0, 4, 2) === 12, scaledPortion 8, flatPortion 4
    test('flat mods are added AFTER multiplication, not before', () => {
        const node = critDamage(withSlot(flatStatOwner({ flat: flatFeat(4) }), weapon(4, 2)))
        expect(node.total()).toBe(12) // 2 * 4 + 4
        expect(findNodeMatching(node, /crit-scaled-portion/i)?.total()).toBe(8)
        expect(findNodeMatching(node, /flat-damage/i)?.total()).toBe(4)
    })

    // ported: applyCritMultiplier(5, 0, 0, 1.5) -> scaledPortion 7.5, total floored to 7
    test('rounds the fractional total down (default x1.5 multiplier)', () => {
        const node = critDamage(withSlot(flatStatOwner(), weapon(5, 1.5)))
        expect(findNodeMatching(node, /crit-scaled-portion/i)?.total()).toBe(7.5)
        expect(node.total()).toBe(7)
    })

    test('a weapon with no explicit critMultiplier defaults to x1.5', () => {
        const node = critDamage(withSlot(flatStatOwner(), weapon(4)))
        expect(findNodeMatching(node, /crit-multiplier/i)?.total()).toBe(1.5)
        expect(node.total()).toBe(6) // floor(1.5 * 4)
    })

    test('the ability modifier scales with the crit (it lives in the scaled bucket)', () => {
        // default character is melee str 15 -> +2; that +2 is multiplied, not added flat
        const node = critDamage(withSlot(createDefaultOwner({}), weapon(8, 2)))
        expect(node.total()).toBe(20) // 2 * (8 + 2)
        expect(findNodeMatching(node, /crit-scalable-damage/i)?.total()).toBe(10)
        console.log(modNodeToText(node))
    })

    test('a scaled feat lands in the scaled bucket, a flat feat in the flat bucket', () => {
        const node = critDamage(withSlot(
            flatStatOwner({ scaler: scalingFeat(3), flat: flatFeat(5) }),
            weapon(4, 2),
        ))
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
        expect(findNodeMatching(node, /test-flat/i)).toBeTruthy()
        expect(node.total()).toBe(19) // 2 * (4 + 3) + 5
    })

    test('the multiplier is a visible child of the product (not a hidden constant)', () => {
        const node = critDamage(withSlot(flatStatOwner(), weapon(4, 2)))
        const scaledPortion = findNodeMatching(node, /crit-scaled-portion/i)
        expect(scaledPortion?.children.length).toBe(2) // crit-multiplier + crit-scalable-damage
        expect(findNodeMatching(scaledPortion!, /crit-multiplier/i)?.total()).toBe(2)
    })

    test('throws when no relevantSlot is provided', () => {
        expect(() => critDamage(flatStatOwner())).toThrow(/relevantSlot/)
    })

    test('throws when relevantSlot is not a weapon', () => {
        expect(() => critDamage(withSlot(flatStatOwner(), leatherArmor))).toThrow(/relevantSlot/)
    })
})
