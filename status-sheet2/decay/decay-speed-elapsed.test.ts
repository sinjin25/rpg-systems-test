import { StatusEffectInstance } from '..'
import { createDefaultOwner, OwnerMaximal } from '../../actor2'
import { decaySpeedElapsed } from './decay-speed-elapsed'
import { describe, test, assert } from 'vitest'

describe('decaySpeedElapsed', () => {
    const speedBuff = (): StatusEffectInstance => ({
        pointer: { displayName: 'test speed status', broadContexts: {}, stack: { kind: 'highest' } },
        source: {} as OwnerMaximal,
        expiration: { kind: 'speed-elapsed', remaining: 10 },
    })
    test('Removes when remaining hits 0', () => {
        const owner = createDefaultOwner({ ss: { test: [speedBuff()] } })

        assert.exists(owner.ss.test)

        const obj = owner.ss.test![0]!
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('incorrect epxiration kind')

        decaySpeedElapsed(owner, 6)
        assert.equal(obj.expiration.remaining, 4)
        assert.exists(owner.ss.test)

        decaySpeedElapsed(owner, 4)
        assert.notExists(owner.ss.test)
    })

    test('Removes when it overshoots', () => {
        const owner = createDefaultOwner({ ss: { test: [speedBuff()] } })

        assert.exists(owner.ss.test)
        decaySpeedElapsed(owner, 25)
        assert.notExists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({ ss: { test: [speedBuff()] } })
        owner.ss.test![0]!.expiration!.kind = 'actions-elapsed'

        assert.exists(owner.ss.test)
        const obj = owner.ss.test![0]!
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'actions-elapsed') throw Error('incorrect epxiration kind')

        decaySpeedElapsed(owner, 10)
        assert.exists(owner.ss.test)
    })
})
