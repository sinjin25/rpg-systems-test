import { describe, test, expect, assert } from 'vitest'
import { createDefaultOwner, instantiateActor } from '../../actor2'
import bearsEndurance from './bears-endurance'
import { addStatusToStatusSheet, getStatusKey } from '../add-status-to-status-sheet'
import { maximumHealth } from '../../log2/terminal'
import { fakeCharacterLevels } from '../../character-sheet/util'
import { reinstantiateHealth } from '../../actor2/instantiate'

// LAYER: bulls-strength (a status definition). It registers a +4 contribution under the
// 'str-from-status' broad context. Whether the owner actually HAS it is str-from-status's job
// (it reads owner.ss); here we just prove the registered contribution is +4.

describe("bulls-strength", () => {
    test('registers a +8 con-from-status contribution', () => {
        const contribution = bearsEndurance.broadContexts['con-from-status']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(8)
    })

    test('Starts with 4 rounds before expiration', () => {
        const owner = createDefaultOwner()

        const a = instantiateActor(owner)

        addStatusToStatusSheet(owner, owner, bearsEndurance)

        const s = owner.ss[getStatusKey(bearsEndurance)]
        assert.exists(s)
        assert.equal(s.length, 1)

        const s0 = s[0]!
        assert.exists(s0)
        // @ts-ignore
        assert.equal(s0!.expiration!.remaining, 4)
    })

    test('Nothing forces a recalc immediately', () => {
        const owner = createDefaultOwner()

        const a = instantiateActor(owner)

        const HEALTH_MAX = a.health.max
        addStatusToStatusSheet(owner, owner, bearsEndurance)

        const key = getStatusKey(bearsEndurance)
        const arr = owner.ss[key]
        assert.exists(arr)
        assert.equal(arr.length, 1)

        assert.equal(HEALTH_MAX, a.health.max)

        reinstantiateHealth(a)

        assert.isTrue(a.health.max > HEALTH_MAX)
    })

    test('Gives more health per level', () => {
        const owner = createDefaultOwner({
            cs: {
                levels: fakeCharacterLevels(5)
            }
        })
        const owner2 = createDefaultOwner({
            cs: {
                levels: fakeCharacterLevels(5)
            }
        })
        addStatusToStatusSheet(owner2, owner2, bearsEndurance)
        const max = maximumHealth(owner)
        const max2 = maximumHealth(owner2)

        const diff = max2.total() - max.total()
        assert.equal(diff, 20)
    })
})
