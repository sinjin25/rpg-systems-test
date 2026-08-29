import { createDefaultOwner, instantiateActor } from '../../actor2'
import { DEFAULT_SPEED, round } from '../../actor2/round.ts'
import applyDamage from '../../health/apply-damage.ts'
import attack from '../../log2/terminal/attack.ts'
import { addStatusToStatusSheet, getStatusKey } from '../../status-sheet2/add-status-to-status-sheet.ts'
import { decayRoundsElapsed } from '../../status-sheet2/decay/decay-rounds-elapsed.ts'
import { makeWrapper } from '../../status-sheet2/index.ts'
import snapshotActor from './actor.ts'
import { describe, test, assert, expect } from 'vitest'

const ownerActorUtil = () => {
    const owner = createDefaultOwner()
    const actor = instantiateActor(owner)
    return { owner, actor }
}

describe('snapshotActor Stable References', () => {
    test('Owner: All stable references point to the same reference and mutating them is bad', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        const ttSnapshot = snapshotActor(actor)

        // the host object is unique
        // @ts-expect-error
        assert.notEqual(actor, ttSnapshot)

        // make sure stable keys are the same
        assert.equal(owner.cs, ttSnapshot.owner.cs)
        assert.equal(owner.fs, ttSnapshot.owner.fs)
        assert.equal(owner.es, ttSnapshot.owner.es)

        owner.cs.con = 999
        assert.equal(owner.cs.con, 999)
        assert.equal(ttSnapshot.owner.cs.con, 999)
    })

})

describe('Actor simple snapshotted elements', () => {
    test('Speed is stable', () => {
        const { actor, owner } = ownerActorUtil()

        // take a snapshot, speed should be equal
        const ttSnapshot = snapshotActor(actor)
        assert.equal(ttSnapshot.speed.remainder, actor.speed.remainder)
        // they do not point to the same object
        assert.notEqual(ttSnapshot.speed, actor.speed)

        // this mutates the actor in the simulation
        round({
            participants: [actor],
            speedSum: DEFAULT_SPEED
        })
        // take a snapshot, speed should be equal
        const ttSnapshot2 = snapshotActor(actor)
        assert.equal(ttSnapshot2.speed.remainder, actor.speed.remainder)

        assert.notEqual(actor.speed.remainder, ttSnapshot.speed.remainder)
    })
    test('Health is stable', () => {
        const { actor, owner } = ownerActorUtil()

        // take a snapshot, health should be equal
        const ttSnapshot = snapshotActor(actor)
        assert.equal(ttSnapshot.health.curr, actor.health.curr)
        // they do not point to the same object
        assert.notEqual(ttSnapshot.health, actor.health)

        // this mutates the actor in the simulation
        applyDamage(actor.health, 1)

        // take a snapshot, health should be equal
        const ttSnapshot2 = snapshotActor(actor)
        assert.equal(ttSnapshot2.health.curr, actor.health.curr)

        assert.notEqual(actor.health.curr, ttSnapshot.health.curr)
    })
})

describe('cloneStatusSheet', () => {
    const buff = makeWrapper(
        { displayName: 'bless', broadContexts: {} },
        { expiration: { kind: 'rounds-elapsed', remaining: 3 } },
    )

    test('freezes each key into an array of frozen statuses, decoupled from the live sheet', () => {
        const { actor, owner } = ownerActorUtil()
        addStatusToStatusSheet(owner, owner, buff)
        const key = getStatusKey(buff)

        const tt0 = snapshotActor(actor)

        // frozen sheet mirrors the key as an array, but is a distinct object graph
        assert.notEqual(owner.ss as unknown, tt0.owner.ss as unknown)
        assert.equal(tt0.owner.ss[key]!.length, 1)
        assert.equal(tt0.owner.ss[key]![0]!.expiration!.remaining, 3)

        // decaying the live instance leaves the earlier snapshot untouched
        decayRoundsElapsed(actor.owner, 1)
        const live = owner.ss[key]![0]!.expiration!
        assert.equal(live.kind === 'rounds-elapsed' && live.remaining, 2)
        assert.equal(tt0.owner.ss[key]![0]!.expiration!.remaining, 3)
    })
})
