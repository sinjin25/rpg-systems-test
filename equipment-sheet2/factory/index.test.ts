import { describe, expect, test } from 'vitest'
import { rollItem } from './index'
import { rollBaseItem, rollModCount } from './equipment-roll'
import { createRoll } from '../../roll'

describe('rollItem', () => {
    test('total affix + suffix count matches the rolled mod count', () => {
        const seed = 0
        const ri = createRoll(seed)
        // rollItem rolls the base item first, so the expectation must consume
        // from the same sequence before reading the mod count
        rollBaseItem('mainhand', ri)
        const expectedCount = rollModCount(ri)

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
