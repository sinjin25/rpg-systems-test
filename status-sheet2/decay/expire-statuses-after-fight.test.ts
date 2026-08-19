import { makeWrapper, StatusEffectInstance, StatusEffectWrapper } from '..'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { expireStatusesAfterFight } from './expire-statuses-after-fight'
import { DecayOwner } from './types'
import { describe, test, assert } from 'vitest'

describe('expireStatusesAfterFight', () => {
    const afterBattleBuff = (
        displayName = 'afterBattleBuff',
        onExpiration?: () => StatusEffectWrapper,
    ): StatusEffectInstance => ({
        pointer: { displayName, broadContexts: {}, stack: { kind: 'highest' }, persists: { afterBattle: true }, onExpiration },
        source: {} as OwnerMaximal,
    })

    test('removes statuses flagged persists.afterBattle', () => {
        const owner: DecayOwner = createDefaultOwner({ ss: { test: [afterBattleBuff()] } })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
    })

    test('keeps statuses flagged persists.afterBattle === false', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: [{
                    pointer: { displayName: 'lingering', broadContexts: {}, stack: { kind: 'highest' }, persists: { afterBattle: false } },
                    source: {} as OwnerMaximal,
                }]
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('keeps statuses with no persists field', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: [{
                    pointer: { displayName: 'permanent', broadContexts: {}, stack: { kind: 'highest' } },
                    source: {} as OwnerMaximal,
                }]
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration for the statuses it removes', () => {
        const followUp = makeWrapper({ displayName: 'follow up', broadContexts: {} })
        const owner: DecayOwner = createDefaultOwner({ ss: { test: [afterBattleBuff('afterBattleBuff', () => followUp)] } })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss['follow up']![0]!.pointer.displayName, 'follow up')
    })
})
