import { makeWrapper, StatusEffectInstance, StatusEffectWrapper } from '..'
import { createDefaultOwner } from '../../actor2'
import { OwnerMaximal } from '../../actor2/types'
import { expireStatusesAfterFight } from './expire-statuses-after-fight'
import { DecayOwner } from './types'
import { describe, test, assert } from 'vitest'

describe('expireStatusesAfterFight', () => {
    const afterBattleBuff = (
        displayName = 'afterBattleBuff',
        onExpiration?: () => StatusEffectWrapper,
    ): StatusEffectInstance => ({
        pointer: { id: displayName, hidden: false, displayName, broadContexts: {}, stack: { kind: 'highest' }, persists: { afterBattle: true }, onExpiration },
        source: {} as OwnerMaximal,
    })

    test('keeps statuses flagged persists.afterBattle', () => {
        const owner: DecayOwner = createDefaultOwner({ ss: { test: [afterBattleBuff()] } })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('removes statuses not flagged persists.afterBattle', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: [{
                    pointer: { id: 'remove', hidden: false, displayName: 'remove', broadContexts: {}, stack: { kind: 'highest' }, persists: { afterBattle: false } },
                    source: {} as OwnerMaximal,
                }]
            }
        })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
    })

    test('ignores statuses with no persists field', () => {
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: [{
                    pointer: { id: 'permanent', hidden: false, displayName: 'permanent', broadContexts: {}, stack: { kind: 'highest' } },
                    source: {} as OwnerMaximal,
                }]
            }
        })

        expireStatusesAfterFight(owner)
        assert.exists(owner.ss.test)
    })

    test('runs onExpiration (chainStatus) for the statuses it removes', () => {
        const followUp = makeWrapper({ id: 'followUp', displayName: 'follow up', broadContexts: {} })
        const owner: DecayOwner = createDefaultOwner({
            ss: {
                test: [{
                    pointer: {
                        id: 'remove',
                        hidden: false,
                        displayName: 'remove',
                        broadContexts: {},
                        stack: { kind: 'highest' },
                        persists: { afterBattle: false },
                        onExpiration: () => followUp,
                    },
                    source: {} as OwnerMaximal,
                }]
            }
        })

        expireStatusesAfterFight(owner)
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss['followUp']![0]!.pointer.displayName, 'follow up')
    })
})
