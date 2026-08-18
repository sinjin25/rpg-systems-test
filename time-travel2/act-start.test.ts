import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import { round } from '../actor2/round.ts'
import actStart from './act-start.ts'
import snapshotActor from './snapshot/actor.ts'
import { describe, test, assert, expect } from 'vitest'

describe('act-start', () => {
    test('', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        actor.speed.remainder = 34
        const r = round({
            participants: [actor],
            speedSum: 35
        })
        assert.equal(r.length, 1)

        // record
        // I don't even know what we're testing
        const as = actStart({
            source: snapshotActor(r[0]!),
        })
    })
})