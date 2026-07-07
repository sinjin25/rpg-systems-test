import { describe, test, assert } from 'vitest'
import calculateFeatMod from './feat-mod.ts'
import { defaultCharacterSheet } from '../character-sheet/index.ts'
import { FeatSheet } from '../feat/index.ts'
import { featMeleeWeaponFighting, featConSaves } from '../feat/feats/index.ts'

describe('calculateFeatMod', () => {
    test('sums only the feats matching the broad context and active contexts', () => {
        const fs: FeatSheet = {
            featMeleeWeaponFighting,
            featConSaves,
        }

        const run = (contexts: Parameters<typeof calculateFeatMod>[1], broad: Parameters<typeof calculateFeatMod>[2]) =>
            calculateFeatMod({
                characterSheet: defaultCharacterSheet,
                equipmentSheet: {},
                featSheet: fs,
            }, contexts, broad)

        // melee weapon fighting grants +1 to both attack and damage in melee
        assert.equal(run(['melee'], 'attack'), 1)
        assert.equal(run(['melee'], 'damage'), 1)
        // but not out of context
        assert.equal(run(['ranged'], 'attack'), 0)
        // con saves feat only touches the save broad context
        assert.equal(run(['constitution'], 'save'), 1)
        assert.equal(run(['constitution'], 'attack'), 0)
    })

    test('empty feat sheet contributes nothing', () => {
        const result = calculateFeatMod({
            characterSheet: defaultCharacterSheet,
            equipmentSheet: {},
            featSheet: {},
        }, ['melee'], 'attack')

        assert.equal(result, 0)
    })
})
