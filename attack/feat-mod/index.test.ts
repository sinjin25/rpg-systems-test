import { defaultCharacterSheet } from '../../character-sheet'
import { addFeat, FeatSheet } from '../../feat'
import { featConSaves, featFinesseWeaponFighting } from '../../feat/feats'
import { default as featMod } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Correctly filters', () => {
    test('correctly filters', () => {
        const fs: FeatSheet = {
            featConSaves,
            featFinesseWeaponFighting,
        }

        const runTheTest = () => {
            return featMod({
                cs: defaultCharacterSheet,
                es: {},
                fs,
            }, ['finesse', 'melee'], 'attack')
        }

        const result = runTheTest()

        assert.equal(
            result.total,
            1,
        )

        addFeat({
            cs: defaultCharacterSheet,
            fs,
        }, {
            key: 'featMeleeWeaponFighting'
        })

        assert.exists(
            fs.featMeleeWeaponFighting
        )
        const result2 = runTheTest()
        assert.equal(
            result2.total,
            2,
        )
    })
})