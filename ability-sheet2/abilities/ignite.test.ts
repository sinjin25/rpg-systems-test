import { createDefaultOwner, instantiateActor } from '../../actor2/index.ts'
import modNodeToText from '../../log2/format.ts'
import { findNodeMatching } from '../../log2/index.ts'
import { applyTicks } from '../../status-sheet2/tick.ts'
import { abilityModNodePayloadIsModNode, abilityModNodePayloadIsStatusEffect } from '../index.ts'
import ignite from './ignite.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Handlers produce outputs', () => {
    test('', () => {
        const owner = createDefaultOwner()
        const ig = ignite(owner)
        const igOnFailedSave = ig.handlers.onFailedSave!

        const nodes = igOnFailedSave()
        assert.equal(Array.isArray(nodes), true)

        const abilityModNode = nodes[0]!
        assert.equal(abilityModNode.target, 'target')

        const payload = abilityModNode.payload
        assert.exists(payload.displayName, 'ignite')

        if (abilityModNodePayloadIsModNode(payload)) throw Error('Expected payload to be a status')
        assert.exists(payload.tick)
    })
})

describe('ignite: integration test', () => {
    test('works with applyTicks', () => {
        const owner = createDefaultOwner()
        const ig = ignite(owner)

        const receiver = createDefaultOwner()
        const receiverActor = instantiateActor(receiver)

        const igOnFailedSave = ig.handlers.onFailedSave!()
        assert.exists(igOnFailedSave)
        assert.isTrue(Array.isArray(igOnFailedSave))
        assert.equal(igOnFailedSave.length, 1)

        const st = igOnFailedSave[0]!.payload
        if (!abilityModNodePayloadIsStatusEffect(st)) throw Error('expected status effect')

        receiverActor.owner.ss['ignite'] = st
        const result = applyTicks(receiverActor)
        console.log('result', result)
        assert.equal(result.length, 1)

        const f0 = findNodeMatching(result[0].calculateDamage, /damage/, {
            includeRoot: true,
        })
        assert.exists(f0)
        console.log(modNodeToText(f0))
    })
})