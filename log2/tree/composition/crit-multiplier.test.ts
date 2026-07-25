import { describe, test, expect } from 'vitest'
import critMultiplier from './crit-multiplier'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal, FeatMaximal } from '../types'
import { Weapon } from '../../../../equipment-sheet'
import { leatherArmor } from '../../../../defaults/equipment'
import { leaf, findNodeMatching } from '../..'

// LAYER: crit-multiplier (composition). weapon base multiplier + feat increments, summed. The base
// comes from relevantSlot.critMultiplier, defaulting to x1.5 (mirrors legacy crit2/multiplier).

const weapon = (crit?: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => 0, critMultiplier: crit } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('crit-multiplier', () => {
    test('uses the weapon base multiplier', () => {
        const node = critMultiplier(withSlot(createDefaultOwner({}), weapon(2)))
        expect(node.total()).toBe(2)
        expect(findNodeMatching(node, /weapon base/i)?.total()).toBe(2)
    })

    test('defaults to x1.5 when the weapon has no explicit critMultiplier', () => {
        expect(critMultiplier(withSlot(createDefaultOwner({}), weapon())).total()).toBe(1.5)
    })

    test('adds feat increments on top of the base', () => {
        const bump: FeatMaximal = {
            displayName: 'improved-crit',
            broadContexts: { 'crit-multiplier-mod': () => leaf('improved-crit', 1) },
        }
        const node = critMultiplier(withSlot(createDefaultOwner({ fs: { bump } }), weapon(2)))
        expect(node.total()).toBe(3) // x2 base + 1
    })

    test('throws when relevantSlot is not a weapon', () => {
        expect(() => critMultiplier(withSlot(createDefaultOwner({}), leatherArmor))).toThrow(/relevantSlot/)
    })
})
