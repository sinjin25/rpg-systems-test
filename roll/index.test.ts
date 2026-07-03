import roll from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('roll', () => {
    test('produces a number', () => {
        assert.equal(
            typeof roll(10),
            'number'
        )
    })
})

describe('simulate', () => {
    test('Is 1-indexed', () => {
        const outputs: Record<number, number> = {}
        for (let i = 0; i < 1000; i++) {
            const result = roll(5)
            if (!outputs[result]) outputs[result] = 1
            else outputs[result]++
        }
        assert.exists(outputs[5])
        assert.notExists(outputs[6])
        assert.notExists(outputs[0])
    })
    test.skip('simulate 10', () => {
        const outputs: Record<number, number> = {}
        for (let i = 0; i < 1000000; i++) {
            const result = roll(10)
            if (!outputs[result]) outputs[result] = 1
            else outputs[result]++
        }
        console.table(outputs)
    })
    test.skip('simulate 20', () => {
        const outputs: Record<number, number> = {}
        for (let i = 0; i < 10000000; i++) {
            const result = roll(20)
            if (!outputs[result]) outputs[result] = 1
            else outputs[result]++
        }
        console.table(outputs)
    })
})