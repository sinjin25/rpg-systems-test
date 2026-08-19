import { createDefaultOwner, instantiateActor } from "../actor2/index.ts";
import { addStatusToStatusSheet, ignite } from "../status-sheet2/index.ts";
import { calculateDamageTicks } from "../status-sheet2/tick.ts";
import { applyDamage } from "../health/index.ts";
import damageOverTime from './damage-over-time-taken.ts'
import { describe, test, assert, expect } from 'vitest'
import snapshotActor from "./snapshot/actor.ts";

describe('damage-over-time', () => {
    test('Snapshots after all ticks have ran', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        addStatusToStatusSheet(owner, owner, ignite)

        const result = calculateDamageTicks(actor)
        assert.equal(result.length, 1)

        const r0 = result[0]! // ignite
        applyDamage(actor.health, r0.node.total())
        assert.isTrue(actor.health.curr < actor.health.max)

        const record = damageOverTime({
            statusSource: r0.source,
            modNode: r0!.node,
            to: [snapshotActor(actor)],
        })

        // confirm freeze on actor
        for (const r of calculateDamageTicks(actor)) {
            applyDamage(actor.health, r.node.total())
        }
        assert.notEqual(actor.health.curr, record.to[0]!.health.curr)

        // confirm freeze on ModNode
        assert.equal(r0!.node.total(), record.modNode.total)
        r0.node.total = () => 99
        assert.notEqual(r0!.node.total(), record.modNode.total)
    })
})