import { createDefaultOwner, instantiateActor, OwnerMaximal } from "../actor2/index.ts";
import { addStatusToStatusSheet } from "../status-sheet2/index.ts";
import { SnapshotStatusEffect } from "../status-sheet2/types.ts";
import { calculateHealTicks } from "../status-sheet2/tick.ts";
import { applyHeal } from "../health/index.ts";
import newModNode, { leaf, sumFunc } from "../log2/index.ts";
import healOverTime from "../log2/terminal/heal-over-time.ts";
import healOverTimeTaken from "../log2/terminal-composition/heal-over-time-taken.ts";
import healOverTimeLog from './heal-over-time-taken.ts'
import { describe, test, assert, expect } from 'vitest'
import snapshotActor from "./snapshot/actor.ts";

// regen has no dedicated status yet, so compose one inline the way ignite composes damage
const regen: SnapshotStatusEffect = (data: { snapshot: OwnerMaximal }) => ({
    displayName: 'regen',
    broadContexts: {},
    tick: {
        calculateHeal: (receiver: OwnerMaximal) => {
            const base = newModNode('regen', [leaf('regen-base', 1)], sumFunc)
            const hot = healOverTime(base)(data.snapshot)
            return healOverTimeTaken({ node: hot })(receiver)
        }
    }
})

describe('heal-over-time', () => {
    test('Snapshots after all ticks have ran', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        addStatusToStatusSheet(owner, regen)

        // give the heals room to matter (and stay below max across ticks)
        actor.health.curr = 1

        const result = calculateHealTicks(actor)
        assert.equal(result.length, 1)

        const r0 = result[0]! // regen
        applyHeal(actor.health, r0.node.total())
        assert.isTrue(actor.health.curr > 1)

        const record = healOverTimeLog({
            statusSource: r0.source,
            modNode: r0!.node,
            to: [snapshotActor(actor)],
        })

        // confirm freeze on actor
        for (const r of calculateHealTicks(actor)) {
            applyHeal(actor.health, r.node.total())
        }
        assert.notEqual(actor.health.curr, record.to[0]!.health.curr)

        // confirm freeze on ModNode
        assert.equal(r0!.node.total(), record.modNode.total)
        r0.node.total = () => 99
        assert.notEqual(r0!.node.total(), record.modNode.total)
    })
})
