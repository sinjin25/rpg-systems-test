import { describe, test, assert } from 'vitest'
import { standardAttackModifierFactory } from '../../attack/index.ts'
import { createDefaultOwner } from '../../defaults/index.ts'
import { decayRoundsElapsed } from '../decay.ts'
import {
    BATTLE_FOCUS_ATTACK_BONUS,
    battleFocusActiveStatus,
    battleFocusChargingStatus,
} from './battle-focus.ts'

describe('battleFocusChargingStatus', () => {
    test('grants no buff while charging', () => {
        const owner = createDefaultOwner({ ss: { battleFocus: battleFocusChargingStatus(3) } })
        const attack = standardAttackModifierFactory({ ...owner, weapon: owner.es.mainhand! })
        const statusModGroup = attack().groups.find(g => g.displayName === 'status mod')!
        assert.isUndefined(statusModGroup.entries.find(e => e.displayName.startsWith('Battle Focus')))
    })

    test('chains into the active buff once its rounds elapse', () => {
        const owner = createDefaultOwner({ ss: { battleFocus: battleFocusChargingStatus(2) } })

        decayRoundsElapsed(owner, 1)
        assert.equal(owner.ss.battleFocus.displayName, 'Battle Focus (Charging)')

        decayRoundsElapsed(owner, 1)
        assert.equal(owner.ss.battleFocus.displayName, 'Battle Focus (Active)')

        const attack = standardAttackModifierFactory({ ...owner, weapon: owner.es.mainhand! })
        const statusModGroup = attack().groups.find(g => g.displayName === 'status mod')!
        const focusMod = statusModGroup.entries.find(e => e.displayName === 'Battle Focus (Active)')!
        assert.equal(focusMod.amount, BATTLE_FOCUS_ATTACK_BONUS)
    })
})

describe('battleFocusActiveStatus', () => {
    test('lasts the rest of the fight (actions-elapsed convention)', () => {
        const status = battleFocusActiveStatus()
        assert.equal(status.expiration.kind, 'actions-elapsed')
    })
})
