import { createDefaultOwner, generateNonPlayerId, generatePlayerId, instantiateActor } from './index.ts'
import { describe, test, assert, expect } from 'vitest'
import { applyDamage, applyHeal } from '../health'

describe('instantiateActor', () => {
    test('Singleton: generate actor ids', () => {
        const playerId = generatePlayerId()
        const enemyId = generateNonPlayerId()
        const enemyId2 = generateNonPlayerId()

        assert.notEqual(playerId, enemyId)
        assert.notEqual(enemyId, enemyId2)

        // ticks up
        assert.equal(enemyId + 1, enemyId2)
        // we cannot predict what these ids are without knowing test execution order

        // playerId is reused (could be bad if not used correctly)
        const owner = createDefaultOwner()
        assert.equal(
            instantiateActor(owner, true).id,
            1
        )
        assert.isTrue(
            instantiateActor(owner).id >= 2)
    })
    test('Creates an Actor2', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        assert.equal(typeof actor.health, 'object')
        assert.equal(typeof actor.speed, 'object')

        assert.strictEqual(owner, actor.owner)
    })
})

describe('Integration: health submodule', () => {
    // confirm this is compatible w/ old health module
    test('health/applyHeal', () => {
        const actor = instantiateActor(createDefaultOwner())
        const { health } = actor
        const { max } = health

        // heals the mutated object in place
        applyDamage(health, 5)
        applyHeal(health, 2)
        assert.equal(health.curr, max - 3)

        // never exceeds the max the new tree produced
        applyHeal(health, 1000)
        assert.equal(health.curr, max)

        // a negative heal is a no-op, not damage
        applyHeal(health, -5)
        assert.equal(health.curr, max)

        // the actor still points at the same health object
        assert.strictEqual(actor.health, health)
    })

    test('health/applyDamage', () => {
        const actor = instantiateActor(createDefaultOwner())
        const { health } = actor
        const { max } = health

        applyDamage(health, 3)
        assert.equal(health.curr, max - 3)

        // temporary health absorbs first
        health.temporary = 4
        applyDamage(health, 2)
        assert.equal(health.temporary, 2)
        assert.equal(health.curr, max - 3)

        // spillover past temporary reaches curr
        applyDamage(health, 5)
        assert.equal(health.temporary, 0)
        assert.equal(health.curr, max - 6)

        // overkill clamps at 0 rather than going negative
        applyDamage(health, 1000)
        assert.equal(health.curr, 0)

        // a negative amount is a no-op, not a heal
        applyDamage(health, -5)
        assert.equal(health.curr, 0)
    })
})