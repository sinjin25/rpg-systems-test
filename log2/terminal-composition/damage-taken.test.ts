import { describe, test, expect, assert } from 'vitest'
import damageTaken from './damage-taken'
import critDamage from '../terminal/crit-damage'
import { createDefaultOwner } from '../../actor2'
import { OwnerLog2 } from '../types'
import studiedTarget from '../../status-sheet2/status/studied-target'
import defensiveRoll from '../../status-sheet2/status/defensive-roll'
import { makeWrapper } from '../../status-sheet2'
import { inst } from '../../status-sheet2/testing'
import { leaf, findNodeMatching } from '..'
import { setSeed, clearSeed } from '../../roll'
import modNodeToText from '../format'
import { BaseEquipment } from '../../equipment-sheet2/types'

const dtStatus = (amount: number) => makeWrapper({
    displayName: 'Test DT',
    broadContexts: { 'damage-taken-status-mod': () => leaf('Test DT', amount) },
})

const weapon = (dmg: number, crit?: number): BaseEquipment => {
    return {
        displayName: 'test-weapon', tags: ['melee'],
        broadContexts: {
            'damage': () => leaf('test-weapon', dmg),
            'crit-multiplier': () => leaf('test-weapon', crit || 1.5)
        }
    }
}
const withSlot = (owner: OwnerLog2, slot: OwnerLog2['relevantSlot']): OwnerLog2 =>
    ({ ...owner, relevantSlot: slot })

describe('damage-taken (terminal)', () => {
    test('passes incoming damage through when the defender has no mods', () => {
        const node = damageTaken({
            node: leaf('incoming', 7)
        })(createDefaultOwner({}))
        expect(node.total()).toBe(7)
    })

    test('Studied Target makes the defender take +2', () => {
        const defender = createDefaultOwner({ ss: { 'Studied Target': [inst(studiedTarget)] } })
        const node = damageTaken({
            node: leaf('incoming', 7)
        })(defender)
        expect(node.total()).toBe(8)
        expect(findNodeMatching(node, /damage-taken-status-mod/i)?.total()).toBe(1)
    })

    test('clamps to 0 so an over-reduction cannot heal', () => {
        const defender = createDefaultOwner({ ss: { a: [inst(dtStatus(-20))] } })
        expect(damageTaken({
            node: leaf('incoming', 7)
        })(defender).total()).toBe(0)
    })

    test('A roll is stable across reads. Feats can reduce/increase', () => {
        setSeed(42)
        try {
            const defender = createDefaultOwner({ ss: { 'Defensive Roll': [inst(defensiveRoll)] } })
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

        const defender = createDefaultOwner({ ss: { 'Studied Target': [inst(studiedTarget)] } })
        const node = damageTaken({
            node: attackerTree,
        })(defender)

        expect(node.total()).toBe(10) // 9 incoming + 1 studied
        // the attacker's crit-damage subtree lives under the local incoming-damage wrapper
        const wrapper = findNodeMatching(node, /incoming-damage/i)
        assert.exists(wrapper)
        assert.equal(wrapper.total(), 9)
        const wrapper2 = findNodeMatching(node, /studied/i)
        assert.exists(wrapper2)
        assert.equal(wrapper2.total(), 1)
        /* console.log(modNodeToText(node)) */
    })
})
