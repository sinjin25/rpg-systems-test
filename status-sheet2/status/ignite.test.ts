import { addStatusToStatusSheet } from '..'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import { applyDamage } from '../../health'
import { findNodeMatching } from '../../log2'
import modNodeToText from '../../log2/format'
import { calculateDamageTicks } from '../tick'
import ignite from './ignite.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Ignite', () => {
    test('works with calculateTick', () => {
        const owner = createDefaultOwner()
        const ig = ignite({
            snapshot: owner,
        })

        const receiver = createDefaultOwner()
        addStatusToStatusSheet(receiver, ig)

        const receiverActor = instantiateActor(receiver)
        assert.equal(receiverActor.health.curr, receiverActor.health.max)

        const results = calculateDamageTicks(receiverActor)

        for (let res of results) {
            console.log(modNodeToText(res.node))
            applyDamage(receiverActor.health, res.node.total())
        }
        const igNode = results[0]!.node
        const f0 = findNodeMatching(igNode, /damage-over-time-taken/, {
            includeRoot: true,
        })
        assert.exists(f0)

        const f1 = findNodeMatching(igNode, /ignite/)
        assert.exists(f1)

        // check if it applied the damage
        assert.notEqual(receiverActor.health.max, receiverActor.health.curr)
    })
})