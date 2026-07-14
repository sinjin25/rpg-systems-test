import { describe, test, assert } from 'vitest'
import { createDefaultOwner } from '../../defaults/index.ts'
import { runTrigger } from '../../trigger/dispatch.ts'
import { featFatiguingBlows } from './fatiguing-blows.ts'

describe('featFatiguingBlows', () => {
    test('onMiss returns an apply-status TriggerEffect targeting the enemy', () => {
        const result = featFatiguingBlows.trigger?.onMiss?.()
        if (!result || Array.isArray(result)) throw Error('Unexpected result for fatiguing blows')
        assert.deepInclude(result, { kind: 'apply-status', recipient: 'target', key: 'fatiguingBlows' })
    })

    test('applies Fatiguing Blows to the enemy when the attacker misses', () => {
        const self = createDefaultOwner({ fs: { featFatiguingBlows } })
        const target = createDefaultOwner({})
        runTrigger({ self, target }, 'onMiss')
        assert.property(target.ss, 'fatiguingBlows')
        assert.equal(
            target.ss.fatiguingBlows.displayName,
            'Fatiguing Blows'
        )
    })

    test('is non-stacking: a second miss does not overwrite the existing status', () => {
        const self = createDefaultOwner({ fs: { featFatiguingBlows } })
        const target = createDefaultOwner({})
        runTrigger({ self, target }, 'onMiss')
        const firstInstance = target.ss.fatiguingBlows
        runTrigger({ self, target }, 'onMiss')
        assert.equal(target.ss.fatiguingBlows, firstInstance)
    })
})
