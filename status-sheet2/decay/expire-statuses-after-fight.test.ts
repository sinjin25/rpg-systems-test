import { StatusEffect } from '..'
import { createDefaultOwner } from '../../actor2'
import { expireStatusesAfterFight } from './expire-statuses-after-fight'
import { DecayOwner } from './types'
import { describe, test, assert } from 'vitest'

describe('expireStatusesAfterFight', () => {
    const afterBattleBuff = (displayName = 'afterBattleBuff'): StatusEffect => ({
        displayName,
        broadContexts: {},
        persists: { afterBattle: true },
    })

    test('removes statuses flagged persists.afterBattle', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: afterBattleBuff()
            }
        })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
    })

    test('keeps statuses flagged persists.afterBattle === false', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: {
                    displayName: 'lingering',
                    broadContexts: {},
                    persists: { afterBattle: false },
                }
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('keeps statuses with no persists field', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: { displayName: 'permanent', broadContexts: {} }
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration for the statuses it removes', () => {
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: { ...afterBattleBuff(), onExpiration: () => followUp }
            }
        })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss['follow up'], followUp)
    })
})
