import { describe, test, expect, assert, beforeEach, afterEach } from 'vitest'
import { createDefaultOwner } from '.'
import { instantiateSpeed, instantiateHealth, applyFlatFooted, STD_SPEED } from './instantiate'
import { setSeed, clearSeed } from '../roll'
import { findNodeMatching } from '../log2'
import { iterate } from '../simulate/util/iterate'

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
        const status = owner.ss['flatFooted']
        assert.exists(status)
        assert.equal(status.displayName, 'flat-footed')

        // duration is the expected value
        const expiration = status.expiration
        if (!expiration) throw Error('expected an expiration')
        if (expiration.kind !== 'speed-elapsed') throw Error('expected speed elapsed type')
        assert.equal(expiration.remaining, STD_SPEED - tree.total())

        // overwrites an existing status of the same key
        const { tree: second } = instantiateSpeed(owner)
        applyFlatFooted(owner, second)

        assert.notStrictEqual(owner.ss['flatFooted'], status)
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
