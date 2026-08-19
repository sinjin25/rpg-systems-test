import { describe, test, assert, expect } from 'vitest'
import { addStatusToStatusSheet, getStatusKey, makeWrapper, newStatusInstance } from '..'
import { createDefaultOwner } from '../../actor2'
import { chainStatus } from './chain-status'
import { expireStatus } from './expire-status'
import { DecayChainStatusLog } from './types'

const followup = makeWrapper({ displayName: 'st2', broadContexts: {} })
const chaining = makeWrapper({ displayName: 'st1', broadContexts: {}, onExpiration: () => followup })

describe('chainStatus', () => {
    test('mints the follow-up instance under its displayName, inheriting the source', () => {
        const owner = createDefaultOwner()
        const source = createDefaultOwner()
        const expired = newStatusInstance(chaining, source)

        const log = chainStatus(owner, expired)
        expect(log).toMatchObject({ key: 'st2', kind: 'replaced', source: expired.pointer } as DecayChainStatusLog)

        const instances = owner.ss['st2']!
        assert.equal(instances.length, 1)
        assert.equal(instances[0]!.pointer.displayName, 'st2')
        assert.equal(instances[0]!.source, source) // inherited from the expired instance
    })

    test('does nothing when there is no onExpiration, or no instance', () => {
        const owner = createDefaultOwner()
        const noChain = newStatusInstance(makeWrapper({ displayName: 'x', broadContexts: {} }), owner)

        assert.equal(chainStatus(owner, noChain), undefined)
        assert.equal(chainStatus(owner, undefined), undefined)
        assert.deepEqual(Object.keys(owner.ss), [])
    })

    test('chained off expireStatus, onExpiration sees the instance already removed', () => {
        const owner = createDefaultOwner()
        let existedDuringCallback: boolean | undefined
        const w = makeWrapper({
            displayName: 'test',
            broadContexts: {},
            onExpiration: () => { existedDuringCallback = owner.ss['test'] !== undefined; return undefined },
        })
        addStatusToStatusSheet(owner, owner, w)
        const inst = owner.ss[getStatusKey(w)]![0]!

        chainStatus(owner, expireStatus(owner, 'test', inst))
        assert.equal(existedDuringCallback, false)
    })
})
