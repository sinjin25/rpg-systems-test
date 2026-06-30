import { CharacterSheet, UseCharacterSheet, DEFAULT_STAT, defaultUseCharacterSheet, defaultCharacterSheet, calculateModifier } from './index'
import { describe, test, assert, expect } from 'vitest'

describe('Test defaults', () => {
    test('defaultCharacterSheet', () => {
        expect(defaultCharacterSheet).toMatchObject({
            str: 15,
            dex: 15,
            con: 15,
        } as CharacterSheet)
    })
})

describe('test default calculateModifier', () => {
    test('works normally', () => {
        assert.equal(calculateModifier(10), 0)
        // round down
        assert.equal(calculateModifier(15), 2)
        assert.equal(calculateModifier(16), 3)
    })
    test('works with negative modifiers', () => {
        assert.equal(calculateModifier(10), 0)
        assert.equal(calculateModifier(8), -1)
        assert.equal(calculateModifier(7), -1)
        assert.equal(calculateModifier(6), -2)
    })
    test('integration: bonuses', () => {
        assert.equal(calculateModifier(10, [0]), 0)
        assert.equal(calculateModifier(10, [4, 2]), 3)
        assert.equal(calculateModifier(10, [-2]), -1)
    })
})