import { describe, expect, test } from 'vitest'
import { rollItem } from './index'
import { rollModCount } from './equipment-roll'
import { createRoll } from '../../roll'

describe('rollItem', () => {
    test('total affix + suffix count matches the rolled mod count', () => {
        const seed = 0
        const expectedCount = rollModCount(createRoll(seed))

        const item = rollItem('mainhand', createRoll(seed))

        expect(item.slot).toBe('mainhand')
        expect(item.affix.length + item.suffix.length).toBe(expectedCount)
    })

    test.skip('temp test for eyeballing', () => {
        const table: Record<number, string> = {}
        for (let i = 0; i < 10; i++) {
            const item = rollItem('mainhand')
            table[i] = JSON.stringify(item)
        }

        console.table(table)
    })
})
