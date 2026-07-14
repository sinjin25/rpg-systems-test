import { describe, test, assert } from 'vitest'
import { standardAttackModifierFactory } from '../../attack/index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import { FATIGUING_BLOWS_ATTACK_PENALTY, fatiguingBlowsStatus } from './fatiguing-blows.ts'
import { util_findRollModifierGroupItem } from '../../roll-modifier/types.ts'

describe('fatiguingBlowsStatus', () => {
    test('applies a flat attack penalty to the enemy holding the status', () => {
        const owner = createDefaultOwner({ ss: { fatiguingBlows: fatiguingBlowsStatus() } })

        // enemy makes attack
        const attack = standardAttackModifierFactory({ ...owner, weapon: owner.es.mainhand! })
        const result = attack()

        // should find the status in their attack mod
        const fatiguingBlowsMod = util_findRollModifierGroupItem(result, {
            groupName: 'status mod',
            modDisplayName: 'Fatiguing Blows',
        })
        assert.exists(fatiguingBlowsMod)
        assert.equal(
            fatiguingBlowsMod.amount,
            FATIGUING_BLOWS_ATTACK_PENALTY
        )
    })

    test('expires via rounds-elapsed', () => {
        const status = fatiguingBlowsStatus()
        assert.equal(status.expiration.kind, 'rounds-elapsed')
    })
})
