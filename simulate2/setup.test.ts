import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import { /* instantiateParticipants, */ resolveParticipants } from './setup.ts'
import { describe, test, assert, expect } from 'vitest'
import { participantIsActor } from './type-guard.ts'
import { deriveFeatKey } from '../feat2/registry.ts'
import { flatFooted } from '../status-sheet2/index.ts'

describe('resolveParticipants', () => {
    test('works', () => {
        const o = createDefaultOwner()
        const o2 = createDefaultOwner()

        // this would be from worldState.playerActors[]
        const oA = instantiateActor(o)

        const res = resolveParticipants([oA, o2])
        for (let i = 1; i < res.length; i++) {
            const prev = res[i - 1]!
            const curr = res[i]!

            // make sure ids are not colliding
            assert.notEqual(prev.id, curr.id)
            assert.isTrue(participantIsActor(curr))
        }
        for (let r of res) {
            assert.isTrue(participantIsActor(r))
        }
    })
    test('Applies flat-footed correctly', () => {
        const o = createDefaultOwner()
        const o2 = createDefaultOwner()

        // this would be from worldState.playerActors[]
        const oA = instantiateActor(o)

        const res = resolveParticipants([oA, o2])
        for (let i = 1; i < res.length; i++) {
            const prev = res[i - 1]!
            const curr = res[i]!

            // make sure ids are not colliding
            assert.notEqual(prev.id, curr.id)
            assert.isTrue(participantIsActor(curr))
        }
        for (let r of res) {
            assert.isTrue(participantIsActor(r))
        }

        assert.exists(o.ss[deriveFeatKey(flatFooted(1))])
    })
})
