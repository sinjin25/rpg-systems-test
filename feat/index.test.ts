import { defaultCharacterSheet } from '../defaults/index.ts'
import { FeatSheet, PossibleFeatKeys, RequiredFeatData } from './types.ts'
import { addFeat } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('featSheet', () => {
    test('works', () => {
        const featSheet: FeatSheet = {}

        addFeat({
            characterSheet: defaultCharacterSheet,
            featSheet,
        }, {
            key: 'featMeleeWeaponFighting'
        })

        assert.exists(
            featSheet,
            'featMeleeWeaponFighting'
        )
    })
})

describe('integration', () => {
    test('feats can use applies', () => {
        const fs: FeatSheet = {}
        addFeat({
            characterSheet: defaultCharacterSheet,
            featSheet: fs,
        }, {
            key: 'featMeleeWeaponFighting'
        })

        const attackApplies = fs.featMeleeWeaponFighting?.context.attack
        assert.equal(!!attackApplies, true)

        assert.equal(
            attackApplies?.applies(['melee']),
            true
        )
        assert.notEqual(
            attackApplies?.applies(['ranged']),
            true,
        )
    })
})