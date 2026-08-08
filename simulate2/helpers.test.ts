import { anyActorAlive, chooseTarget, handlePotentialDeath, ownerIsMemberOf, targetIsAlive } from './helpers.ts'
import { describe, test, assert, expect } from 'vitest'
import { resolveParticipants } from './setup.ts'
import { createDefaultOwner, instantiateActor } from '../actor2/index.ts'

describe('ownerIsMemberOf', () => {
    test('works', () => {
        const players = resolveParticipants([
            createDefaultOwner()
        ])
        const enemies = resolveParticipants(
            [createDefaultOwner(),
            createDefaultOwner()]
        )
        const participants = [
            ...enemies,
            ...players,
        ]

        assert.isFalse(
            ownerIsMemberOf(players[0].owner, enemies)
        )
        assert.isTrue(
            ownerIsMemberOf(enemies[0].owner, enemies)
        )
        // obviously, everyone is a member of the set with everyone
        assert.isTrue(
            ownerIsMemberOf(enemies[0].owner, participants)
        )
    })
})

describe('chooseTarget', () => {
    test('selects first available actor', () => {
        const o1 = createDefaultOwner()
        const o2 = createDefaultOwner()
        const o3 = createDefaultOwner()
        const actors = resolveParticipants([o1, o2, o3])

        const target = chooseTarget(actors)
        assert.equal(target, actors[0])

        // mark 0 and 2 as dead (!speed.canAct)
        actors[0]!.speed.canAct = false
        actors[2]!.speed.canAct = false

        const target2 = chooseTarget(actors)
        assert.equal(target2, actors[1])
    })
})

describe('handlePotentialDeath', () => {
    test('', () => {
        const actors = [instantiateActor(createDefaultOwner()), instantiateActor(createDefaultOwner())]

        actors[0].health.curr = 0

        // reducing health.curr to 0 does not immediately trigger death
        assert.isTrue(targetIsAlive(actors[0]))

        handlePotentialDeath(actors, actors[0], actors[1].owner)

        assert.isFalse(targetIsAlive(actors[0]))
    })
})

describe('anyActorAlive', () => {
    test('', () => {
        const actors = [instantiateActor(createDefaultOwner()), instantiateActor(createDefaultOwner())]

        actors[0].health.curr = 0

        handlePotentialDeath(actors, actors[0], actors[1].owner)

        assert.isFalse(targetIsAlive(actors[0]))

        // subset is everyone
        assert.isTrue(anyActorAlive(actors))

        // get a smaller subset
        assert.isFalse(anyActorAlive([
            actors[0]
        ]))
    })
})