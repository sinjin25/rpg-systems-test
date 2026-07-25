import { describe, test, expect } from 'vitest'
import critScalableDamage from './crit-scalable-damage'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal, FeatMaximal } from '../types'
import { Weapon } from '../../../../equipment-sheet'
import { daggerPlusOne, leatherArmor } from '../../../../defaults/equipment'
import { leaf, findNodeMatching } from '../..'

// LAYER: crit-scalable-damage (composition). Sums the weapon's rolled damage, the effective attack
// stat, and the crit-scalable feat mods - the bucket ELIGIBLE to be multiplied on a crit (not
// multiplied here). Also owns the relevantSlot weapon guard that both the damage and crit-damage
// terminals inherit.

const weapon = (dmg: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => dmg } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('crit-scalable-damage', () => {
    test('sums weapon roll + effective stat (default melee str +2)', () => {
        const node = critScalableDamage(withSlot(createDefaultOwner({}), weapon(8)))
        expect(node.total()).toBe(10) // 8 + 2
    })

    test('includes crit-scalable feat mods', () => {
        const scaler: FeatMaximal = {
            displayName: 'test-scaler',
            broadContexts: { 'crit-scalable-damage-feat-mod': () => leaf('test-scaler', 3) },
        }
        const node = critScalableDamage(withSlot(createDefaultOwner({ cs: { str: 10 }, fs: { scaler } }), weapon(8)))
        expect(node.total()).toBe(11) // 8 + 0 str + 3
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
    })

    test('the die comes from relevantSlot, the stat from the mainhand', () => {
        // finesse dagger in the mainhand routes the stat to dex (18 -> +4)
        const node = critScalableDamage(withSlot(
            createDefaultOwner({ cs: { dex: 18, str: 10 }, es: { mainhand: daggerPlusOne } }),
            weapon(8),
        ))
        expect(node.total()).toBe(12) // 8 + 4 dex
    })

    test('throws when no relevantSlot is provided', () => {
        expect(() => critScalableDamage(createDefaultOwner({}))).toThrow(/relevantSlot/)
    })

    test('throws when relevantSlot is not a weapon', () => {
        expect(() => critScalableDamage(withSlot(createDefaultOwner({}), leatherArmor))).toThrow(/relevantSlot/)
    })
})
