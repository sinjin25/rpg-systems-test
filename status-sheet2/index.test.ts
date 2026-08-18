import { createDefaultOwner } from '../actor2'
import { addStatusToStatusSheet, getStatusKey, makeWrapper } from './index.ts'
import { describe, test, assert } from 'vitest'

const buff = makeWrapper({ displayName: 'buff', broadContexts: {} })
const other = makeWrapper({ displayName: 'other', broadContexts: {} })

describe('addStatusToStatusSheet', () => {
    test('mints an instance under the displayName key, recording the creator as source', () => {
        const owner = createDefaultOwner()
        const creator = createDefaultOwner()
        assert.notExists(owner.ss[getStatusKey(buff)])

        addStatusToStatusSheet(owner, creator, buff)

        const instances = owner.ss[getStatusKey(buff)]!
        assert.equal(instances.length, 1)
        assert.equal(instances[0]!.pointer.displayName, 'buff')
        assert.equal(instances[0]!.source, creator)
    })

    test('falls back to the owner as source when no creator is given', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, undefined, buff)
        assert.equal(owner.ss[getStatusKey(buff)]![0]!.source, owner)
    })

    test('stacks repeated applications into the key and adds distinct statuses separately', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, owner, buff, buff, other)
        assert.equal(owner.ss['buff']!.length, 2)
        assert.equal(owner.ss['other']!.length, 1)
    })
})
