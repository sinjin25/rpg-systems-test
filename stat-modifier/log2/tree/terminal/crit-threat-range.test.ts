import { describe, test, expect } from 'vitest'
import critThreatRange from './crit-threat-range'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal } from '../types'
import { Weapon } from '../../../../equipment-sheet'
import { leatherArmor } from '../../../../defaults/equipment'
import { findNodeMatching } from '../..'
import improvedCritical from '../feats/improved-critical'
import modNodeToText from '../../format'

// LAYER: crit-threat-range (terminal). Sums the weapon's base critRange with the crit-threat-range-mod
// feat aggregator (its own suite). So this proves the assembly - the weapon base is read from
// relevantSlot and the feat mod is wired in. Ports legacy crit2/range: base + feat mod, summed, where
// negative widens (Improved Critical takes a 20 down to 19). The base default is 20 (nat-20 only).

// a weapon whose critRange is fixed, so the threshold is exact without touching the RNG
const weapon = (critRange?: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => 1, critRange } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('crit-threat-range (terminal)', () => {
    test('defaults to 20 when the weapon declares no critRange and no feats apply', () => {
        const node = critThreatRange(withSlot(createDefaultOwner({}), weapon()))
        expect(node.total()).toBe(20)
        expect(node.children.length).toBe(2) // weapon base + crit-threat-range-mod
        expect(findNodeMatching(node, /crit\-threat\-range\-mod/i)?.total()).toBe(0)
    })

    test('a weapon can declare its own base (keen rapier critRange 18)', () => {
        const node = critThreatRange(withSlot(createDefaultOwner({}), weapon(18)))
        expect(node.total()).toBe(18)
    })

    test('improved-critical widens a base-20 weapon to 19 (negative widens)', () => {
        const node = critThreatRange(withSlot(
            createDefaultOwner({ fs: { improvedCritical } }),
            weapon(),
        ))
        expect(node.total()).toBe(19) // base 20 + (-1)
        const mod = findNodeMatching(node, /crit\-threat\-range\-mod/i)
        expect(mod?.total()).toBe(-1)
        expect(findNodeMatching(mod!, /improved\-critical/i)).toBeTruthy()
        console.log(modNodeToText(node))
    })

    test('total is exactly the sum of its children (trusts them)', () => {
        const node = critThreatRange(withSlot(
            createDefaultOwner({ fs: { improvedCritical } }),
            weapon(18),
        ))
        const childSum = node.children.reduce((acc, c) => acc + c.total(), 0)
        expect(node.total()).toBe(childSum)
        expect(node.total()).toBe(17) // 18 + (-1)
    })

    test('throws when no relevantSlot is provided', () => {
        expect(() => critThreatRange(createDefaultOwner({}))).toThrow(/relevantSlot/)
    })

    test('throws when relevantSlot is not a weapon', () => {
        expect(() => critThreatRange(withSlot(createDefaultOwner({}), leatherArmor))).toThrow(/relevantSlot/)
    })
})
