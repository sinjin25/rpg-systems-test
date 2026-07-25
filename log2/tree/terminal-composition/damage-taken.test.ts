import { describe, test, expect } from 'vitest'
import damageTaken from './damage-taken'
import critDamage from '../terminal/crit-damage'
import { createDefaultOwner } from '../../defaults'
import { OwnerMaximal, StatusEffectMaximal } from '../types'
import { Weapon } from '../../../../equipment-sheet'
import studiedTarget from '../bases/status/studied-target'
import defensiveRoll from '../bases/status/defensive-roll'
import { leaf, findNodeMatching } from '../..'
import { setSeed, clearSeed } from '../../../../roll'
import modNodeToText from '../../format'

// LAYER: damage-taken (terminal). The first CROSS-ACTOR tree: it takes the DEFENDER's owner plus an
// already-finished incoming-damage ModNode built from the ATTACKER's owner, and folds
// max(0, incoming + defender feat mods + defender status mods). The incoming tree is sealed - embedded,
// never recomputed or mutated. Each sub-problem has its own suite, so this proves the assembly, the
// clamp, the cross-actor handoff, and that the foreign tree is left untouched.

const dtStatus = (amount: number): StatusEffectMaximal => ({
    displayName: 'Test DT',
    broadContexts: { 'damage-taken-status-mod': () => leaf('Test DT', amount) },
})

const weapon = (dmg: number, crit?: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => dmg, critMultiplier: crit } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('damage-taken (terminal)', () => {
    test('passes incoming damage through when the defender has no mods', () => {
        const node = damageTaken(createDefaultOwner({}), leaf('incoming', 7))
        expect(node.total()).toBe(7)
    })

    test('Studied Target makes the defender take +2', () => {
        const defender = createDefaultOwner({ ss: { 'Studied Target': studiedTarget } })
        const node = damageTaken(defender, leaf('incoming', 7))
        expect(node.total()).toBe(9)
        expect(findNodeMatching(node, /damage-taken-status-mod/i)?.total()).toBe(2)
    })

    test('clamps to 0 so an over-reduction cannot heal', () => {
        const defender = createDefaultOwner({ ss: { a: dtStatus(-20) } })
        expect(damageTaken(defender, leaf('incoming', 7)).total()).toBe(0)
    })

    test('a defensive roll subtracts a frozen 1d4 (stable across reads)', () => {
        setSeed(42)
        try {
            const defender = createDefaultOwner({ ss: { 'Defensive Roll': defensiveRoll } })
            const node = damageTaken(defender, leaf('incoming', 10))
            const first = node.total()
            expect(first).toBeGreaterThanOrEqual(6) // 10 - 4
            expect(first).toBeLessThanOrEqual(9)    // 10 - 1
            expect(node.total()).toBe(first)        // die frozen, not rerolled
        } finally {
            clearSeed()
        }
    })

    test('cross-actor: consumes the attacker\'s finished crit-damage tree', () => {
        // attacker A: default melee str +2, x2 weapon dealing 8 -> crit 2*(8+2) = 20
        const attacker = withSlot(createDefaultOwner({}), weapon(8, 2))
        const incoming = critDamage(attacker)
        expect(incoming.total()).toBe(20)

        // defender B: a DIFFERENT owner, studied -> +2 taken
        const defender = createDefaultOwner({ ss: { 'Studied Target': studiedTarget } })
        const node = damageTaken(defender, incoming)

        expect(node.total()).toBe(22) // 20 incoming + 2 studied
        // the attacker's crit-damage subtree lives under the local incoming-damage wrapper
        const wrapper = findNodeMatching(node, /incoming-damage/i)
        expect(findNodeMatching(wrapper!, /crit-damage/i)).toBeTruthy()
        console.log(modNodeToText(node))
    })

    test('the incoming (foreign) tree is sealed: not mutated by damage-taken', () => {
        const attacker = withSlot(createDefaultOwner({}), weapon(8, 2))
        const incoming = critDamage(attacker)
        const before = incoming.total()
        const beforeChildren = incoming.children.length

        damageTaken(createDefaultOwner({ ss: { 'Studied Target': studiedTarget } }), incoming)

        expect(incoming.total()).toBe(before)
        expect(incoming.children.length).toBe(beforeChildren)
    })
})
