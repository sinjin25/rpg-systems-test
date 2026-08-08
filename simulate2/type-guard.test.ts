import { createDefaultOwner, instantiateActor } from '../actor2'
import { participantIsActor, } from './type-guard.ts'
import { describe, test, assert, expect } from 'vitest'

describe('participantIsActor', () => {
    test('Works', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        assert.equal(participantIsActor(owner), false)
        assert.equal(participantIsActor(actor), true)
    })
})