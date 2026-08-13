import { createDefaultOwner, instantiateActor } from "../actor2";
import { addStatusToStatusSheet, ignite } from "../status-sheet2";
import { applyTicks } from "../status-sheet2/tick";
import damageOverTime from './damage-over-time.ts'
import { describe, test, assert, expect } from 'vitest'

describe('damage-over-time', () => {
    test('Snapshots after all ticks have ran', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        addStatusToStatusSheet(owner, ignite)

        const result = applyTicks(actor)
        assert.equal(result.length, 1)

        const r0 = result[0]! // ignite
        assert.isTrue(actor.health.curr < actor.health.max)

        const record = damageOverTime({
            statusSource: r0.source,
            modNode: r0!.calculateDamage,
            to: [actor],
        })

        // confirm freeze on actor
        applyTicks(actor)
        assert.notEqual(actor.health.curr, record.to[0]!.health.curr)

        // confirm freeze on ModNode
        assert.equal(r0!.calculateDamage.total(), record.modNode.total)
        r0.calculateDamage.total = () => 99
        assert.notEqual(r0!.calculateDamage.total(), record.modNode.total)
    })
})