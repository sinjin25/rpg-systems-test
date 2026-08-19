import { describe, test, assert } from 'vitest'
import { addStatusToStatusSheet, makeWrapper, newStatusInstance } from '..'
import { createDefaultOwner } from '../../actor2'
import { expireStatus } from './expire-status'

const buff = makeWrapper({ displayName: 'buff', broadContexts: {}, stack: { kind: 'stack' } })

describe('expireStatus', () => {
    test('removes a single instance and deletes the key once empty', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, owner, buff)
        const inst = owner.ss['buff']![0]!

        const removed = expireStatus(owner, 'buff', inst)
        assert.equal(removed, inst)
        assert.notExists(owner.ss['buff'])
    })

    test('removes only the targeted instance, leaving the rest under the key', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, owner, buff, buff)
        const [a, b] = owner.ss['buff']!

        expireStatus(owner, 'buff', a!)
        assert.equal(owner.ss['buff']!.length, 1)
        assert.equal(owner.ss['buff']![0], b)
    })

    test('returns undefined when the instance is not on the key', () => {
        const owner = createDefaultOwner()
        const stray = newStatusInstance(buff, owner)
        assert.equal(expireStatus(owner, 'buff', stray), undefined)
    })
})
