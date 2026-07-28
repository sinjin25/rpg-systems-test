import { describe, test, expect, assert } from 'vitest'
import damageTaken from './damage-taken'
import critDamage from '../terminal/crit-damage'
import { createDefaultOwner } from '../defaults'
import { BaseEquipment, ObjectWithBroadContexts, OwnerMaximal } from '../types'
import { Weapon } from '../../equipment-sheet'
import studiedTarget from '../bases/status/studied-target'
import defensiveRoll from '../bases/status/defensive-roll'
import { leaf, findNodeMatching } from '..'
import { setSeed, clearSeed } from '../../roll'
import modNodeToText from '../format'

const dtStatus = (amount: number): ObjectWithBroadContexts => ({
    displayName: 'Test DT',
    broadContexts: { 'damage-taken-status-mod': () => leaf('Test DT', amount) },
})

const weapon = (dmg: number, crit?: number): Weapon =>
    ({ displayName: 'test-weapon', contexts: ['melee'], damage: () => dmg, critMultiplier: crit } as Weapon)

const withSlot = (owner: OwnerMaximal, slot: OwnerMaximal['relevantSlot']): OwnerMaximal =>
    ({ ...owner, relevantSlot: slot })

describe('damage-taken (terminal)', () => {
    test('passes incoming damage through when the defender has no mods', () => {
        const node = damageTaken({
            node: leaf('incoming', 7)
        })(createDefaultOwner({}))
        expect(node.total()).toBe(7)
    })

    test('Studied Target makes the defender take +2', () => {
        const defender = createDefaultOwner({ ss: { 'Studied Target': studiedTarget } })
        const node = damageTaken({
            node: leaf('incoming', 7)
        })(defender)
        expect(node.total()).toBe(9)
        expect(findNodeMatching(node, /damage-taken-status-mod/i)?.total()).toBe(2)
    })

    test('clamps to 0 so an over-reduction cannot heal', () => {
        const defender = createDefaultOwner({ ss: { a: dtStatus(-20) } })
        expect(damageTaken({
            node: leaf('incoming', 7)
        })(defender).total()).toBe(0)
    })

    test('A roll is stable across reads. Feats can reduce/increase', () => {
        setSeed(42)
        try {
            const defender = createDefaultOwner({ ss: { 'Defensive Roll': defensiveRoll } })
            const node = damageTaken({
                node: leaf('incoming', 10),
            })(defender)
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
        const wp: BaseEquipment = {
            displayName: 'test-weapon',
            broadContexts: {
                damage: (o) => leaf('test-weapon', 4),
            }
        }
        const attacker = createDefaultOwner({
            es: { mainhand: wp }
        })
        const attackerTree = critDamage(attacker)

        /* console.log(modNodeToText(attackerTree)) */
        expect(attackerTree.total()).toBe(9) // 4 * 1.5

        const defender = createDefaultOwner({ ss: { 'Studied Target': studiedTarget } })
        const node = damageTaken({
            node: attackerTree,
        })(defender)

        expect(node.total()).toBe(11) // 9 incoming + 2 studied
        // the attacker's crit-damage subtree lives under the local incoming-damage wrapper
        const wrapper = findNodeMatching(node, /incoming-damage/i)
        assert.exists(wrapper)
        assert.equal(wrapper.total(), 9)
        const wrapper2 = findNodeMatching(node, /studied/i)
        assert.exists(wrapper2)
        assert.equal(wrapper2.total(), 2)
        /* console.log(modNodeToText(node)) */
    })
})
