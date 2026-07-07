import roll, { setSeed, clearSeed } from './index.ts'
import { describe, test, assert, expect, afterEach } from 'vitest'

describe('roll', () => {
    test('produces a number', () => {
        assert.equal(
            typeof roll(10),
            'number'
        )
    })
})

describe('seeded rolls', () => {
    // keep seeding from leaking into the statistical tests below
    afterEach(() => clearSeed())

    test('same seed produces the same sequence', () => {
        setSeed(42)
        const first = [roll(20), roll(20), roll(20), roll(6), roll(6)]

        setSeed(42)
        const second = [roll(20), roll(20), roll(20), roll(6), roll(6)]

        assert.deepEqual(first, second)
    })

    test('different seeds produce different sequences', () => {
        const sequence = (seed: number) => {
            setSeed(seed)
            const rolls = []
            for (let i = 0; i < 20; i++) rolls.push(roll(20))
            return rolls.join(',')
        }

        assert.notEqual(sequence(1), sequence(2))
    })

    test('seeded rolls stay 1-indexed and in range', () => {
        setSeed(7)
        for (let i = 0; i < 1000; i++) {
            const result = roll(6)
            expect(result).toBeGreaterThanOrEqual(1)
            expect(result).toBeLessThanOrEqual(6)
        }
    })

    test('clearSeed restores unseeded behavior', () => {
        setSeed(42)
        const seeded = roll(20)
        clearSeed()

        // an unseeded sequence should not replay the seeded one;
        // 20 consecutive matches by chance is ~20^-20
        setSeed(42)
        const replay = []
        for (let i = 0; i < 20; i++) replay.push(roll(20))
        clearSeed()
        const fresh = []
        for (let i = 0; i < 20; i++) fresh.push(roll(20))

        assert.equal(typeof seeded, 'number')
        assert.notEqual(replay.join(','), fresh.join(','))
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