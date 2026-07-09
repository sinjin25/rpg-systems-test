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
                cs: defaultCharacterSheet,
                es: {},
                fs,
            }, contexts, broad)

        // melee weapon fighting grants +1 to both attack and damage in melee
        assert.equal(run(['melee'], 'attack').total, 1)
        assert.equal(run(['melee'], 'damage').total, 1)
        // but not out of context
        assert.equal(run(['ranged'], 'attack').total, 0)
        // con saves feat only touches the save broad context
        assert.equal(run(['constitution'], 'save').total, 1)
        assert.equal(run(['constitution'], 'attack').total, 0)

        // each contributing feat is named in the entries
        assert.deepEqual(run(['melee'], 'attack').entries, [
            { displayName: featMeleeWeaponFighting.displayName, amount: 1 },
        ])
    })

    test('empty feat sheet contributes nothing', () => {
        const result = calculateFeatMod({
            cs: defaultCharacterSheet,
            es: {},
            fs: {},
        }, ['melee'], 'attack')

        assert.equal(result.total, 0)
        assert.deepEqual(result.entries, [])
    })
})
