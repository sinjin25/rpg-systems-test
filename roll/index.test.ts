import roll, { createRoll } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('roll', () => {
    test('produces a number', () => {
        assert.equal(
            typeof roll(10),
            'number'
        )
    })
})

describe('createRoll', () => {
    test('produces a number in range', () => {
        const instance = createRoll(1)
        for (let i = 0; i < 1000; i++) {
            const result = instance.roll(6)
            expect(result).toBeGreaterThanOrEqual(1)
            expect(result).toBeLessThanOrEqual(6)
        }
    })

    test('Can produce the seed', () => {
        const randomInst = createRoll()
        assert.typeOf(randomInst.getSeed(), 'number')

        const oneSeed = createRoll(1)
        assert.equal(oneSeed.getSeed(), 1)
    })

    test('same seed produces the same sequence', () => {
        const first = createRoll(42)
        const second = createRoll(42)

        const rollFive = (instance: ReturnType<typeof createRoll>) =>
            [instance.roll(20), instance.roll(20), instance.roll(20), instance.roll(6), instance.roll(6)]

        assert.deepEqual(rollFive(first), rollFive(second))
    })

    test('different seeds produce different sequences', () => {
        const sequence = (seed: number) => {
            const instance = createRoll(seed)
            const rolls: number[] = []
            for (let i = 0; i < 20; i++) rolls.push(instance.roll(20))
            return rolls.join(',')
        }

        assert.notEqual(sequence(1), sequence(2))
    })

    test('sibling instances are independent from one another', () => {
        const a = createRoll(1)
        const b = createRoll(2)

        const aBefore = a.roll(20)
        b.roll(20)
        b.roll(20)
        const aAfter = createRoll(1)

        assert.equal(aBefore, aAfter.roll(20))
    })

    test('spawn() is deterministic given the same parent seed and call order', () => {
        const parentA = createRoll(7)
        const parentB = createRoll(7)

        const mapSeedA = parentA.spawn()
        const fightSeedA = parentA.spawn()
        const mapSeedB = parentB.spawn()
        const fightSeedB = parentB.spawn()

        assert.deepEqual(
            [mapSeedA.roll(20), mapSeedA.roll(20)],
            [mapSeedB.roll(20), mapSeedB.roll(20)],
        )
        assert.deepEqual(
            [fightSeedA.roll(20), fightSeedA.roll(20)],
            [fightSeedB.roll(20), fightSeedB.roll(20)],
        )

        // each spawn() consumes one rng call from the parent
        assert.equal(parentA._totalRolls(), 2)
        assert.equal(parentB._totalRolls(), 2)
    })

    test('successive spawn() calls hand out decorrelated children', () => {
        const parent = createRoll(7)
        const first = parent.spawn()
        const second = parent.spawn()

        const sequence = (instance: ReturnType<typeof createRoll>) => {
            const rolls: number[] = []
            for (let i = 0; i < 20; i++) rolls.push(instance.roll(20))
            return rolls.join(',')
        }

        assert.notEqual(sequence(first), sequence(second))
    })

    test('unseeded instance still rolls in range', () => {
        const instance = createRoll()
        for (let i = 0; i < 1000; i++) {
            const result = instance.roll(6)
            expect(result).toBeGreaterThanOrEqual(1)
            expect(result).toBeLessThanOrEqual(6)
        }
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