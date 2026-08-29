import { describe, test, expect, assert } from 'vitest'
import critScalableDamage from './crit-scalable-damage'
import { createDefaultOwner } from '../../actor2'
import { ObjectWithBroadContexts } from '../types'
import { leaf, findNodeMatching } from '..'
import { BaseEquipment } from '../../equipment-sheet2/types'
import { SLOT_TYPE } from '../../equipment-sheet2/defaults'
import { makeWrapper } from '../../status-sheet2'
import { inst } from '../../status-sheet2/testing'

const weapon = (dmg: number): BaseEquipment =>
({
    displayName: 'test-weapon', acceptableSlots: SLOT_TYPE.weapon, tags: ['melee'], broadContexts: {
        'damage': () => leaf('test-weapon', 8)
    }
})

const st = makeWrapper({
    displayName: 'test-damage-status',
    broadContexts: {
        'crit-scalable-damage-status-mod': () => leaf('test-damage-status', 2)
    },
}, { expiration: { kind: 'rounds-elapsed', remaining: 3 } })

describe('crit-scalable-damage', () => {
    test('sums weapon roll + effective stat (default melee str +2)', () => {
        const node = critScalableDamage(createDefaultOwner({ es: { mainhand: weapon(8) } }))
        expect(node.total()).toBe(10) // 8 + 2
    })

    test('includes crit-scalable feat mods', () => {
        const scaler: ObjectWithBroadContexts = {
            displayName: 'test-scaler',
            broadContexts: { 'crit-scalable-damage-feat-mod': () => leaf('test-scaler', 3) },
        }
        const node = critScalableDamage(createDefaultOwner({ cs: { str: 10 }, fs: { scaler }, es: { mainhand: weapon(8) } }))
        expect(node.total()).toBe(11) // 8 + 0 str + 3
        expect(findNodeMatching(node, /test-scaler/i)).toBeTruthy()
    })

    test('includes crit-scalable status mods', () => {
        const owner = createDefaultOwner({
            ss: { st: [inst(st)] }
        })

        const node = critScalableDamage(owner)
        const f0 = findNodeMatching(node, /test-damage-status/)
        assert.exists(f0)
        assert.equal(f0.total(), 2)
    })
})
