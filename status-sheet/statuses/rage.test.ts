import { describe, test, assert } from 'vitest'
import { standardAttackModifierFactory } from '../../attack/index.ts'
import { standardDamageModifierFactory } from '../../damage/index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import { RAGE_ATTACK_BONUS, RAGE_DAMAGE_BONUS, rageStatus } from './rage.ts'
import { util_findRollModifierGroupItem } from '../../roll-modifier/types.ts'

describe('rageStatus', () => {
    test('adds a flat attack bonus', () => {
        const owner = createDefaultOwner({ ss: { rage: rageStatus(5) } })
        const attack = standardAttackModifierFactory({ ...owner, weapon: owner.es.mainhand! })
        const result = attack()
        const rageMod = util_findRollModifierGroupItem(result, {
            groupName: 'status mod',
            modDisplayName: 'Rage',
        })
        assert.exists(rageMod)
        assert.equal(rageMod.amount, RAGE_ATTACK_BONUS)
    })

    test('adds a flat damage bonus', () => {
        const owner = createDefaultOwner({ ss: { rage: rageStatus(5) } })
        const damage = standardDamageModifierFactory({ ...owner, weapon: owner.es.mainhand! })
        const result = damage()
        const rageMod = util_findRollModifierGroupItem(result, {
            groupName: 'status mod',
            modDisplayName: 'Rage',
        })
        assert.exists(rageMod)
        assert.equal(rageMod.amount, RAGE_DAMAGE_BONUS)
    })

    test('expires via rounds-elapsed', () => {
        const status = rageStatus(5)
        assert.equal(status.expiration.kind, 'rounds-elapsed')
        assert.equal((status.expiration as any).remaining, 5)
    })
})
