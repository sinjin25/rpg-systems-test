import { describe, test, assert } from 'vitest'
import { applyStatusTriggerEffect, applyTriggerEffect } from './apply'
import { TriggerEffectApplyStatus } from './core-types'
import { StatusEffect } from '../status-sheet/core-types'

const dummyStatus: StatusEffect = {
    displayName: 'Dummy',
    context: {},
    expiration: { kind: 'rounds-elapsed', remaining: 1 },
}

const makeOwners = () => ({
    self: { ss: {} },
    target: { ss: {} },
})

describe('applyStatusTriggerEffect', () => {
    test('applies the status to the target recipient', () => {
        const owners = makeOwners()
        const effect: TriggerEffectApplyStatus = { kind: 'apply-status', recipient: 'target', key: 'dummy', status: dummyStatus }
        applyStatusTriggerEffect(owners, effect)
        // @ts-expect-error
        assert.equal(owners.target.ss.dummy, dummyStatus)
        assert.notProperty(owners.self.ss, 'dummy')
    })

    test('applies the status to the self recipient', () => {
        const owners = makeOwners()
        const effect: TriggerEffectApplyStatus = { kind: 'apply-status', recipient: 'self', key: 'dummy', status: dummyStatus }
        applyStatusTriggerEffect(owners, effect)
        // @ts-expect-error
        assert.equal(owners.self.ss.dummy, dummyStatus)
        assert.notProperty(owners.target.ss, 'dummy')
    })

    test('is non-stacking: does not overwrite an existing status under the same key', () => {
        const owners = makeOwners()
        const existing: StatusEffect = { ...dummyStatus, displayName: 'Existing' }
        // @ts-expect-error
        owners.target.ss.dummy = existing
        const effect: TriggerEffectApplyStatus = { kind: 'apply-status', recipient: 'target', key: 'dummy', status: dummyStatus }
        applyStatusTriggerEffect(owners, effect)
        // @ts-expect-error
        assert.equal(owners.target.ss.dummy, existing)
    })
})

describe('applyTriggerEffect', () => {
    test('dispatches apply-status effects to applyStatusTriggerEffect', () => {
        const owners = makeOwners()
        const effect: TriggerEffectApplyStatus = { kind: 'apply-status', recipient: 'target', key: 'dummy', status: dummyStatus }
        applyTriggerEffect(owners, effect)
        // @ts-expect-error
        assert.equal(owners.target.ss.dummy, dummyStatus)
    })
})
