import { describe, test, expect, assert } from 'vitest'
import critScalableDamage from './crit-scalable-damage'
import { createDefaultOwner } from '../../actor2'
import { OwnerLog2, ObjectWithBroadContexts } from '../types'
import { leaf, findNodeMatching } from '..'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { StatusEffect } from '../../status-sheet2'

const weapon = (dmg: number): BaseEquipment =>
({
    displayName: 'test-weapon', tags: ['melee'], broadContexts: {
        'damage': () => leaf('test-weapon', 8)
    }
})

const withSlot = (owner: OwnerLog2, slot: OwnerLog2['relevantSlot']): OwnerLog2 =>
    ({ ...owner, relevantSlot: slot })

const st: StatusEffect = {
    displayName: 'test-damage-status',
    broadContexts: {
        'crit-scalable-damage-status-mod': () => leaf('test-damage-status', 2)
    },
    expiration: { kind: 'rounds-elapsed', remaining: 3 },
}

describe('crit-scalable-damage', () => {
    test('sums weapon roll + effective stat (default melee str +2)', () => {
        const node = critScalableDamage(withSlot(createDefaultOwner({}), weapon(8)))
        expect(node.total()).toBe(10) // 8 + 2
    })

    test('includes crit-scalable feat mods', () => {
        const scaler: ObjectWithBroadContexts = {
            displayName: 'test-scaler',
            broadContexts: { 'crit-scalable-damage-feat-mod': () => leaf('test-scaler', 3) },
        }
        const node = critScalableDamage(withSlot(createDefaultOwner({ cs: { str: 10 }, fs: { scaler } }), weapon(8)))
        expect(node.total()).toBe(11) // 8 + 0 str + 3
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
    })

    test('includes crit-scalable status mods', () => {
        const owner = createDefaultOwner({
            ss: { st }
        })

        const node = critScalableDamage(owner)
        const f0 = findNodeMatching(node, /test-damage-status/)
        assert.exists(f0)
        assert.equal(f0.total(), 2)
    })
    test('throws when no relevantSlot is provided', () => {
        const owner = createDefaultOwner()
        owner.relevantSlot = undefined
        expect(() => critScalableDamage(owner)).toThrow(/relevant/)
    })
})
