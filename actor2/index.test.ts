import { createDefaultOwner, instantiateActor } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('instantiateActor', () => {
    test('Creates an Actor2', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        assert.equal(typeof actor.health, 'object')
        assert.equal(typeof actor.speed, 'object')

        assert.strictEqual(owner, actor.owner)
    })
})