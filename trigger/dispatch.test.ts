import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../defaults/index.ts'
import { runTrigger } from './dispatch.ts'
import { Feat } from '../feat/core-types.ts'
import { StatusEffect } from '../status-sheet/core-types.ts'

const featOnMiss: Feat = {
    displayName: 'Test Feat On Miss',
    context: {},
    trigger: {
        onMiss: () => ({ kind: 'apply-status', recipient: 'target', key: 'testStatus', status: {
            displayName: 'Test Status',
            context: {},
            expiration: { kind: 'rounds-elapsed', remaining: 1 },
        } }),
    },
}

const featOnHitMultiple: Feat = {
    displayName: 'Test Feat On Hit Multiple',
    context: {},
    trigger: {
        onHit: () => [
            { kind: 'apply-status', recipient: 'self', key: 'statusA', status: { displayName: 'A', context: {}, expiration: { kind: 'rounds-elapsed', remaining: 1 } } },
            { kind: 'apply-status', recipient: 'self', key: 'statusB', status: { displayName: 'B', context: {}, expiration: { kind: 'rounds-elapsed', remaining: 1 } } },
        ],
    },
}

const statusOnKill: StatusEffect = {
    displayName: 'Status That Reacts To Kill',
    context: {},
    expiration: { kind: 'rounds-elapsed', remaining: 1 },
    trigger: {
        onKill: () => ({ kind: 'apply-status', recipient: 'self', key: 'killBonus', status: {
            displayName: 'Kill Bonus',
            context: {},
            expiration: { kind: 'rounds-elapsed', remaining: 1 },
        } }),
    },
}

describe('runTrigger', () => {
    test('applies the TriggerEffect returned by a feat hook to the target', () => {
        const self = createDefaultOwner({ fs: { featOnMiss } as any })
        const target = createDefaultOwner({})
        runTrigger({ self, target }, 'onMiss')
        assert.property(target.ss, 'testStatus')
        assert.notProperty(self.ss, 'testStatus')
    })

    test('applies every TriggerEffect when a hook returns an array', () => {
        const self = createDefaultOwner({ fs: { featOnHitMultiple } as any })
        const target = createDefaultOwner({})
        runTrigger({ self, target }, 'onHit')
        assert.property(self.ss, 'statusA')
        assert.property(self.ss, 'statusB')
    })

    test('also runs hooks defined on active statuses, not just feats', () => {
        const self = createDefaultOwner({ ss: { statusOnKill } })
        const target = createDefaultOwner({})
        runTrigger({ self, target }, 'onKill')
        assert.property(self.ss, 'killBonus')
    })

    test('is a no-op when nothing defines the hook', () => {
        const self = createDefaultOwner({})
        const target = createDefaultOwner({})
        runTrigger({ self, target }, 'onCrit')
        assert.deepEqual(self.ss, {})
        assert.deepEqual(target.ss, {})
    })
})
