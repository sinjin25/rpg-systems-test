import { iterate } from '../../simulate/util/iterate'
import { clearSeed, setSeed } from '../../roll'
import burningWeaponStatus from './burning-weapon'
import { decaySaveSucceeded } from '../decay'
import { createDefaultOwner } from '../../actor2'
import { afterEach, assert, describe, expect, test } from 'vitest'
import { findNodeMatching, leaf } from '../../log2'
import modNodeToText from '../../log2/format'

const setupOwner = () => {
    const creator = createDefaultOwner({
        fs: {
            'dot-plus': {
                displayName: 'dot-plus',
                broadContexts: {
                    'damage-over-time-feat-mod': () => leaf('dot-plus', 2)
                }
            }
        }
    })
    return createDefaultOwner({
        ss: {
            burning: burningWeaponStatus({
                snapshot: creator,
            }),
        }
    })
}

describe('burningWeaponStatus wires into decaySaveSucceeded', () => {
    const PASS_SEED = 1
    const FAIL_SEED = 0

    afterEach(() => {
        clearSeed()
    })

    test('a passing reflex save removes the burning status', () => {
        const owner = setupOwner()
        setSeed(FAIL_SEED)
        decaySaveSucceeded(owner)
        assert.exists(owner.ss.burning)
    })

    test('a failing reflex save keeps the burning status', () => {
        const owner = setupOwner()
        setSeed(PASS_SEED)
        decaySaveSucceeded(owner)
        assert.notExists(owner.ss.burning)
    })

    test('both outcomes are reachable across seeds', () => {
        // iterate seeds 0..19 and confirm the burn is sometimes shaken off and
        // sometimes not - proving the save-succeeded path can both keep and remove it
        const outcomes = iterate(60, () => {
            const owner = setupOwner()
            assert.exists(owner.ss.burning)
            decaySaveSucceeded(owner)
            return !!owner.ss.burning
        })

        const total = outcomes.length
        const expectedFailProportion = .6 // DC 15, +2 to save, don't want to do a billion tests
        const realFailProportion = outcomes.filter(a => a === true).length

        expect(realFailProportion / total).toBeGreaterThanOrEqual(expectedFailProportion)
    })

    test('Has a tick', () => {
        const owner = setupOwner()
        const obj = owner.ss.burning
        assert.exists(obj)

        assert.exists(obj.tick)
        // calculates properly
        setSeed(0)
        const damageTaken = obj.tick.calculateDamage!(owner)
        console.log(modNodeToText(damageTaken))

        const f0 = findNodeMatching(damageTaken, /damage-over-time-taken/, {
            includeRoot: true,
        })
        assert.exists(f0)
        assert.equal(f0.total(), 4)

        const f1 = findNodeMatching(damageTaken, /dot-plus/)
        assert.exists(f1)
        assert.equal(f1.total(), 2)

        clearSeed()
    })
})
