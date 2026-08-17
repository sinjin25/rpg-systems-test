import { CharacterSheet, defaultCharacterSheet } from './index'
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