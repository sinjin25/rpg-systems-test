import { createDefaultOwner } from '../../actor2'
import { findNodeMatching } from '../../log2/index.ts'
import attack from '../../log2/terminal/attack.ts'
import damage from '../../log2/terminal/damage.ts'
import { decayRoundsElapsed } from '../decay'
import battleFocus, { BATTLE_FOCUS_ATTACK_BONUS, BATTLE_FOCUS_DAMAGE_BONUS, battleFocusActiveStatus, battleFocusChargingStatus } from './battle-focus.ts'
import { inst } from '../testing.ts'
import { describe, test, assert, expect } from 'vitest'

describe('battle-focus', () => {
    test('initial status grants no buff', () => {
        const owner = createDefaultOwner({
            cs: {
                str: 10,
            },
            ss: {
                battleFocus: [inst(battleFocus(3))],
            },
        })
        const atk = attack(owner)
        assert.equal(atk.total(), 1) // + 1 bab

        assert.exists(owner.ss.battleFocus)
    })
    test('Chains into active buff correctly', () => {
        const owner = createDefaultOwner({
            cs: {
                str: 10,
            },
            ss: {
                battleFocus: [inst(battleFocus(2))],
            },
        })

        decayRoundsElapsed(owner, 1)
        const obj = owner.ss.battleFocus![0]!
        assert.equal(obj.pointer.displayName, 'Battle Focus')
        if (!obj.expiration || obj.expiration.kind !== 'rounds-elapsed') throw Error('unexpected obj.expiration')
        assert.equal(obj?.expiration?.remaining, 1)

        decayRoundsElapsed(owner, 1)
        // should be replaced by a new status under a new key
        assert.notExists(owner.ss.battleFocus)
        const obj2 = owner.ss['Battle Focus (Active)']![0]!
        assert.notEqual(obj.pointer.displayName, obj2.pointer.displayName)
        assert.equal(obj2.pointer.displayName, 'Battle Focus (Active)')
    })
    test('Active buff buffs', () => {
        const owner = createDefaultOwner({
            cs: {
                str: 10,
            },
            ss: {
                battleFocus: [inst(battleFocusActiveStatus())],
            },
        })

        const atk = attack(owner)
        const f0 = findNodeMatching(atk, /battle focus/i)
        const dmg = damage(owner)
        const f1 = findNodeMatching(dmg, /battle focus/i)

        assert.exists(f0)
        assert.exists(f1)

        assert.equal(f0.total(), BATTLE_FOCUS_ATTACK_BONUS)
        assert.equal(f1.total(), BATTLE_FOCUS_DAMAGE_BONUS)
    })
})