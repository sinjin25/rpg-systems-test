import { createDefaultOwner, instantiateActor } from '../../actor2'
import { DEFAULT_SPEED, round } from '../../actor2/round.ts'
import applyDamage from '../../health/apply-damage.ts'
import attack from '../../log2/terminal/attack.ts'
import { addStatusToStatusSheet, getStatusKey } from '../../status-sheet2/add-status-to-status-sheet.ts'
import { decayRoundsElapsed } from '../../status-sheet2/decay/decay-rounds-elapsed.ts'
import { bless, rage, StatusEffect } from '../../status-sheet2/index.ts'
import burningWeaponStatus from '../../status-sheet2/status/burning-weapon.ts'
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
    test('cloneRelevantSlot (temp?)', () => {
        const { actor, owner } = ownerActorUtil()

        const ttSnapshot = snapshotActor(actor)
        assert.equal(ttSnapshot.owner.relevantSlot, actor.owner.relevantSlot)
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

describe('OwnerMaximalUnstableReferences (mostly proper clones)', () => {
    // most of these, theoretically, should be mostly snapshotted (as in same values, different references). This is not entirely true for some of them.
    test('cloneTags', () => {
        const { actor, owner } = ownerActorUtil()
        const ttSnapshot = snapshotActor(actor)
        assert.notEqual(ttSnapshot.owner.tags, owner.tags)

        // this mutates tags
        const node = attack(actor.owner)
        // snapshot looks similar
        const ttSnapshot2 = snapshotActor(actor)
        assert.equal(owner.tags.length, 2)
        assert.equal(ttSnapshot2.owner.tags.length, 2)

        // confirm old snapshot remains unchanged
        assert.equal(ttSnapshot.owner.tags.length, 0)
    })
})

describe('cloneStatusSheet is rough', () => {
    /* test('save-succeeded kind throws', () => {
        const { actor, owner } = ownerActorUtil()
        addStatusToStatusSheet(owner, burningWeaponStatus)

        assert.throws(() => snapshotActor(actor), /need to freeze the dc and save/)
    }) */

    test('Record reference behavior', () => {
        const { actor, owner } = ownerActorUtil()
        const myStatus: StatusEffect = {
            broadContexts: {},
            displayName: 'bless',
            expiration: {
                kind: 'rounds-elapsed',
                remaining: 3,
            }
        }
        addStatusToStatusSheet(owner, myStatus)

        const tt0 = snapshotActor(actor)

        // host is not the same (good)
        // @ts-expect-error
        assert.notEqual(owner.ss, tt0.owner.ss)

        // keys exist on both (good)
        assert.exists(tt0.owner.ss[getStatusKey(myStatus)])
        assert.exists(owner.ss[getStatusKey(myStatus)])

        // the individual status is a different object (good)
        assert.notEqual(
            tt0.owner.ss[getStatusKey(myStatus)],
            // @ts-expect-error
            owner.ss[getStatusKey(myStatus)]
        )

        decayRoundsElapsed(actor.owner, 1)
        // @ts-expect-error
        assert.equal(owner.ss[getStatusKey(myStatus)]!.expiration!.remaining, 2)
        assert.notEqual(
            // @ts-expect-error
            owner.ss[getStatusKey(myStatus)]!.expiration!.remaining,
            tt0.owner.ss[getStatusKey(myStatus)]!.expiration!.remaining,
        )

    })

    test.skip('Snapshots works correctly (they dont)')
})
