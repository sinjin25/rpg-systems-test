import { StatusEffect } from '..'
import { createDefaultOwner } from '../../actor2'
import { decayActionsElapsed } from './decay-actions-elapsed'
import { describe, test, assert } from 'vitest'

describe('decayActionsElapsed', () => {
    const actionsBuff = (): StatusEffect => ({
        displayName: 'actionsBuff',
        broadContexts: {},
        expiration: {
            kind: 'actions-elapsed',
            remaining: 2,
        }
    })
    test('removes status when the action count hits 0', () => {
        const owner = createDefaultOwner({
            ss: {
                test: actionsBuff()
            }
        })
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'actions-elapsed') throw Error('incorrect epxiration kind')

        decayActionsElapsed(owner, 1)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 1)

        decayActionsElapsed(owner, 1)
        assert.notExists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: actionsBuff()
            }
        })
        owner.ss.test!.expiration!.kind = 'speed-elapsed'

        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('incorrect epxiration kind')

        decayActionsElapsed(owner, 5)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 2)
    })
})
