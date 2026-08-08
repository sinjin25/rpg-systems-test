import { createDefaultOwner, instantiateActor } from '../actor2'
import { /* instantiateParticipants, */ resolveParticipants, setupWorldState } from './setup.ts'
import { describe, test, assert, expect } from 'vitest'
import { participantIsActor } from './type-guard.ts'

/* describe('instantiateParticipants', () => {
    test('Works', () => {
        const o = createDefaultOwner()
        const o2 = createDefaultOwner()

        const part = [o, o2]

        const inst = instantiateParticipants(part)
        assert.isTrue(Array.isArray(inst))

        assert.equal(
            inst[0].owner,
            o
        )

        assert.equal(
            inst[1].owner,
            o2
        )
    })
}) */

describe('resolveParticipants', () => {
    test('works', () => {
        const o = createDefaultOwner()
        const o2 = createDefaultOwner()

        // this would be from worldState.playerActors[]
        const oA = instantiateActor(o)

        const res = resolveParticipants([oA, o2])
        for (let r of res) {
            assert.isTrue(participantIsActor(r))
        }
    })
})

describe('setupWorldState', () => {
    test('works', () => {
        const player = createDefaultOwner()

        const ws = setupWorldState({
            player,
        })

        assert.exists(ws.playerActors)
        assert.exists(ws.playersAfterFight)
        assert.equal(player, ws.playerActors[0]!.owner)
    })
    test.skip('.playerAfterFight')
})