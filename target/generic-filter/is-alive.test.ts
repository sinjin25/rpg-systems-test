import { createDefaultOwner, instantiateActor } from '../../actor2'
import isAlive from './is-alive.ts'
import { describe, test, assert, expect } from 'vitest'

describe('is-alive', () => {
    test('', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        const isOkay = isAlive(actor)
        assert.isTrue(isOkay)

        actor.health.curr = 0
        const isNotOkay = isAlive(actor)
        assert.isNotTrue(isNotOkay)
    })
})