import { createDefaultOwner, OwnerMaximal } from '../actor2'
import { addStatusToStatusSheet, SnapshotStatusEffect, StatusEffect } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('addStatusToStatusSheet', () => {
    const st: SnapshotStatusEffect = (data: {
        snapshot: OwnerMaximal
    }) => {
        return {
            displayName: 'snapshot',
            broadContexts: {},
        }
    }
    const st2: StatusEffect = {
        displayName: 'status',
        broadContexts: {}
    }
    test('works with SnapshotStatusEffect', () => {
        const owner = createDefaultOwner()

        const missing = owner.ss['snapshot']
        assert.notExists(missing)
        addStatusToStatusSheet(owner, st)
        const status = owner.ss['snapshot']
        assert.exists(status)
        assert.equal(status.displayName, 'snapshot')
    })

    test('works with StatusEffect', () => {
        const owner = createDefaultOwner()

        const missing = owner.ss['status']
        assert.notExists(missing)
        addStatusToStatusSheet(owner, st2)
        const status = owner.ss['status']
        assert.exists(status)
        assert.equal(status.displayName, 'status')
    })

    test('works with multiple', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, st, st2)
        assert.exists(owner.ss['snapshot'])
        assert.exists(owner.ss['status'])
    })
})