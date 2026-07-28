import { describe, test, expect } from 'vitest'
import critScalableDamage from './crit-scalable-damage'
import { createDefaultOwner } from '../defaults'
import { OwnerMaximal, FeatMaximal, BaseEquipment } from '../types'
import { Weapon } from '../../equipment-sheet'
import { leaf, findNodeMatching } from '..'

const weapon = (dmg: number): BaseEquipment =>
({
    displayName: 'test-weapon', tags: ['melee'], broadContexts: {
        'damage': () => leaf('test-weapon', 8)
    }
})

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

    test('throws when no relevantSlot is provided', () => {
        const owner = createDefaultOwner()
        owner.relevantSlot = undefined
        expect(() => critScalableDamage(owner)).toThrow(/relevant/)
    })
})
