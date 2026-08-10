import { StatusEffect } from '..'
import { createDefaultOwner, instantiateActor, OwnerMaximal } from '../../actor2'
import { decayRoundsElapsed } from './decay-rounds-elapsed'
import { describe, test, assert } from 'vitest'
import { leaf } from '../../log2'

describe('decayRoundsElapsed', () => {
    const roundsBuff = (): StatusEffect => ({
        displayName: 'roundsBuff',
        broadContexts: {},
        expiration: {
            kind: 'rounds-elapsed',
            remaining: 3,
        }
    })

    test('decrements remaining and removes at 0', () => {
        const owner = createDefaultOwner({
            ss: {
                test: roundsBuff()
            }
        })
        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'rounds-elapsed') throw Error('incorrect epxiration kind')

        decayRoundsElapsed(owner, 1)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 2)

        decayRoundsElapsed(owner, 2)
        assert.notExists(owner.ss.test)
    })

    test('removes when it overshoots', () => {
        const owner = createDefaultOwner({
            ss: {
                test: roundsBuff()
            }
        })

        assert.exists(owner.ss.test)
        decayRoundsElapsed(owner, 25)
        assert.notExists(owner.ss.test)
    })

    test('dni with different kinds of statuses', () => {
        const owner = createDefaultOwner({
            ss: {
                test: roundsBuff()
            }
        })
        owner.ss.test!.expiration!.kind = 'speed-elapsed'

        const obj = owner.ss.test
        if (!obj.expiration) throw Error('expected expiration')
        if (obj.expiration.kind !== 'speed-elapsed') throw Error('incorrect epxiration kind')

        decayRoundsElapsed(owner, 10)
        assert.exists(owner.ss.test)
        assert.equal(obj.expiration.remaining, 3)
    })

    test('runs onExpiration when it decays', () => {
        const followUp: StatusEffect = {
            displayName: 'follow up',
            broadContexts: {},
        }
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    onExpiration: () => followUp,
                }
            }
        })

        decayRoundsElapsed(owner, 3)
        assert.notExists(owner.ss.test)
        assert.equal(owner.ss['follow up'], followUp)
    })

    test('passes the owner, not self, to tick', () => {
        let seen: unknown = undefined
        const owner = createDefaultOwner({
            ss: {
                test: {
                    ...roundsBuff(),
                    expiration: {
                        kind: 'rounds-elapsed',
                        remaining: 3
                    },
                    tick: {
                        calculateHeal(data: OwnerMaximal) {
                            seen = data
                            return leaf('roundsBuff', 3)
                        }
                    }
                }
            }
        })
        const self = instantiateActor(owner)

        decayRoundsElapsed(owner, 1, self)
    })
})
