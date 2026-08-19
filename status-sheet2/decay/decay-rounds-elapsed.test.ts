import { describe, test, assert } from 'vitest'
import { addStatusToStatusSheet, makeWrapper } from '..'
import { createDefaultOwner } from '../../actor2'
import { decayRoundsElapsed } from './decay-rounds-elapsed'

const roundsBuff = (remaining: number) =>
    makeWrapper({ displayName: 'buff', broadContexts: {} }, { expiration: { kind: 'rounds-elapsed', remaining } })

describe('decayRoundsElapsed', () => {
    test('decrements per-instance remaining and expires the instance at zero', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, owner, roundsBuff(2))

        decayRoundsElapsed(owner, 1)
        assert.equal(owner.ss['buff']![0]!.expiration!.kind === 'rounds-elapsed' && owner.ss['buff']![0]!.expiration!.remaining, 1)

        decayRoundsElapsed(owner, 1)
        assert.notExists(owner.ss['buff'])
    })

    test('ignores instances whose expiration is not rounds-elapsed', () => {
        const owner = createDefaultOwner()
        const speed = makeWrapper({ displayName: 'slow', broadContexts: {} }, { expiration: { kind: 'speed-elapsed', remaining: 1 } })
        addStatusToStatusSheet(owner, owner, roundsBuff(1), speed)

        decayRoundsElapsed(owner, 5)
        assert.notExists(owner.ss['buff'])
        assert.exists(owner.ss['slow'])
    })

    test('chains into the follow-up status when an instance expires', () => {
        const owner = createDefaultOwner()
        const followup = makeWrapper({ displayName: 'next', broadContexts: {} })
        const charge = makeWrapper(
            { displayName: 'charge', broadContexts: {}, onExpiration: () => followup },
            { expiration: { kind: 'rounds-elapsed', remaining: 1 } },
        )
        addStatusToStatusSheet(owner, owner, charge)

        decayRoundsElapsed(owner, 1)
        assert.notExists(owner.ss['charge'])
        assert.exists(owner.ss['next'])
    })
})
