import { describe, test, expect, assert, beforeEach, afterEach } from 'vitest'
import { createDefaultOwner, instantiateActor } from '.'
import { instantiateSpeed, instantiateHealth, applyFlatFooted, STD_SPEED, _reinstantiateHealth, reinstantiateHealth } from './instantiate'
import { setSeed, clearSeed } from '../roll'
import { findNodeMatching } from '../log2'
import { iterate } from '../simulate/util/iterate'
import { addStatusToStatusSheet, bearsEndurance, getStatusKey } from '../status-sheet2'
import { decayRoundsElapsed } from '../status-sheet2/decay'

describe('instantiateSpeed', () => {
    beforeEach(() => setSeed(1))
    afterEach(() => clearSeed())

    test('Returns a tree and a speed object', () => {
        const owner = createDefaultOwner({})

        const { tree, speed } = instantiateSpeed(owner)

        assert.exists(findNodeMatching(tree, /starting speed/, { depth: 0, includeRoot: true }))

        assert.equal(speed.remainder, STD_SPEED - tree.total())

        assert.isTrue(speed.canAct)
    })

    test('remainder can go negative when the roll beats STD_SPEED', () => {
        // dex 100 is a +45 mod, so any d20 roll puts the total past STD_SPEED
        const owner = createDefaultOwner({ cs: { dex: 100 } })

        const { tree, speed } = instantiateSpeed(owner)

        expect(tree.total()).toBeGreaterThan(STD_SPEED)
        assert.equal(speed.remainder, STD_SPEED - tree.total())
        expect(speed.remainder).toBeLessThan(0)
    })

    test('Rolls produce different results', () => {
        const owner = createDefaultOwner({})
        const set = new Set<number>()
        iterate(10, () => {
            const { tree, speed } = instantiateSpeed(owner)
            set.add(speed.remainder)
        })

        assert.notEqual(set.size, 1)
    })
})

describe('applyFlatFooted', () => {
    test('Applies correctly', () => {
        // default owner doesn't have the status
        const owner = createDefaultOwner({})
        const nonExistent = owner.ss['flatFooted']
        assert.notExists(nonExistent)

        // instantiate speed runs
        const { tree } = instantiateSpeed(owner)
        applyFlatFooted(owner, tree)

        // owner should have it now in owner.ss
        const status = owner.ss['flatFooted']![0]!
        assert.exists(status)
        assert.equal(status.pointer.displayName, 'flat-footed')

        // duration is the expected value
        const expiration = status.expiration
        if (!expiration) throw Error('expected an expiration')
        if (expiration.kind !== 'speed-elapsed') throw Error('expected speed elapsed type')
        assert.equal(expiration.remaining, STD_SPEED - tree.total())

        // overwrites an existing status of the same key
        const { tree: second } = instantiateSpeed(owner)
        applyFlatFooted(owner, second)

        assert.notStrictEqual(owner.ss['flatFooted']![0], status)
    })

    test('Does nothing if speed was negative', () => {
        // dex 100 is a +45 mod so player acts instantly
        const owner = createDefaultOwner({ cs: { dex: 100 } })

        const { tree } = instantiateSpeed(owner)
        expect(STD_SPEED - tree.total()).toBeLessThan(0)

        applyFlatFooted(owner, tree)

        assert.notExists(owner.ss['flatFooted'])
    })
})

describe('instantiateHealth', () => {
    test('Returns a tree and a Health object', () => {
        const owner = createDefaultOwner({})

        const { tree, health } = instantiateHealth(owner)

        // Both keys should exists
        assert.exists(tree)
        assert.exists(health)
        assert.exists(findNodeMatching(tree, /maximum-health/, { depth: 0, includeRoot: true }))

        // health.max should = tree.total()
        assert.equal(health.max, tree.total())

        // curr should be set to max
        assert.equal(health.curr, health.max)

        // temporary starts at 0
        assert.equal(health.temporary, 0)
    })
})

describe('_reinstantiateHealth', () => {
    test('Recalculates the same numbers', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        const re = _reinstantiateHealth(actor)
        assert.equal(re.health.max, actor.health.max)
        assert.equal(re.health.curr, actor.health.curr)
    })
    test('boundary: curr is 0', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        actor.health.curr = 0

        const re = _reinstantiateHealth(actor)
        assert.equal(re.health.max, actor.health.max)
        assert.equal(re.health.curr, actor.health.curr)

        assert.equal(re.health.curr, 0)
    })
    test('Buffs recalculate correctly @ max', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)

        const HEALTH_MAX = actor.health.max
        const HEALTH = actor.health.curr

        addStatusToStatusSheet(owner, owner, bearsEndurance)

        const re = _reinstantiateHealth(actor)
        assert.notEqual(HEALTH_MAX, re.health.max)
        assert.notEqual(HEALTH, re.health.curr)
    })
    test('Buffs recalculate correctly', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        actor.health.curr = Math.floor(actor.health.curr * .66)
        assert.equal(actor.health.curr, 21)

        const HEALTH_MAX = actor.health.max
        const HEALTH = actor.health.curr

        addStatusToStatusSheet(owner, owner, bearsEndurance)

        const re = _reinstantiateHealth(actor)
        assert.notEqual(HEALTH_MAX, re.health.max)
        assert.notEqual(HEALTH, re.health.curr)

        assert.equal(re.health.curr, 24)
    })
    test('Buff expiration would calculate correctly', () => {
        const owner = createDefaultOwner()
        addStatusToStatusSheet(owner, owner, bearsEndurance)
        const actor = instantiateActor(owner)

        actor.health.curr = Math.floor(actor.health.curr * .66)
        assert.equal(actor.health.curr, 23)

        decayRoundsElapsed(owner, 4)
        assert.notExists(owner.ss[getStatusKey(bearsEndurance)])

        // decay is health-agnostic; simulate reconciles via reinstantiateHealth
        const re = _reinstantiateHealth(actor)
        assert.notEqual(actor.health.max, re.health.max)
        assert.notEqual(actor.health.curr, re.health.curr)

        assert.equal(re.health.curr, 21)
    })
})

describe('reinstantiateHealth', () => {
    test('no-ops when max is unchanged (guards against ceil drift)', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        actor.health.curr = Math.floor(actor.health.curr * .66)
        const before = { ...actor.health }

        reinstantiateHealth(actor)

        // no buff changed max, so health is left exactly as-is
        assert.deepEqual(actor.health, before)
    })
    test('mutates actor health in place when a buff changes max', () => {
        const owner = createDefaultOwner()
        const actor = instantiateActor(owner)
        const oldMax = actor.health.max

        addStatusToStatusSheet(owner, owner, bearsEndurance)
        reinstantiateHealth(actor)

        assert.isAbove(actor.health.max, oldMax)
        assert.equal(actor.health.curr, actor.health.max) // was at full
    })
})