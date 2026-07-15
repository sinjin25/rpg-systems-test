import { describe, test, assert, expect } from 'vitest'

import burningWeaponStatus from './burning-weapon'
import { decaySaveSucceeded } from '../decay'
import { StatusSheet } from '../types'
import { defaultCharacterSheet } from '../../character-sheet'
import { defaultFeatSheet } from '../../feat'
import { defaultEquipmentSheet } from '../../equipment-sheet'
import { iterate } from '../../simulate/util/iterate'
import { createDefaultOwner } from '../../defaults'
import { afterEach } from 'node:test'
import { clearSeed, setSeed } from '../../roll'

const setupOwner = () => {
    return createDefaultOwner({
        ss: {
            burning: burningWeaponStatus(),
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
})
