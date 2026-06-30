import { default as finesseAttackModifierFactory } from './finesse'
import { describe, test, assert, expect } from 'vitest'
import { defaultCharacterSheet } from '../character-sheet'

describe('factory works', () => {
    test('default character sheet', () => {
        const myFunc = finesseAttackModifierFactory({
            characterSheet: defaultCharacterSheet,
            equipmentSheet: {},
            featSheet: {},
            statusSheet: {},
        })

        const result = myFunc()
        assert.equal(result, 2)
    })
    test('works with arbitrary sheets', () => {
        const myFunc = finesseAttackModifierFactory({
            characterSheet: {
                con: 0,
                dex: 0,
                str: 0,
            },
            equipmentSheet: {},
            featSheet: {},
            statusSheet: {},
        })

        const result = myFunc()
        assert.equal(result, -5)
    })
})