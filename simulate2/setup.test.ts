import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'
import { /* instantiateParticipants, */ resolveParticipants, setupWorldState } from './setup.ts'
import { describe, test, assert, expect } from 'vitest'
import { participantIsActor } from './type-guard.ts'

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
    test('Uses playerId for instantiated actor always (id === 1)', () => {
        const player = createDefaultOwner()

        const ws = setupWorldState({ player })
        assert.equal(ws.playerActors[0]!.id, 1)

        const ws2 = setupWorldState({ player })
        assert.equal(ws2.playerActors[0]!.id, 1)
    })
    test.skip('.playerAfterFight')
})