import roll, { setSeed, clearSeed, createRoll } from './index.ts'
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
            const rolls: number[] = []
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
        const replay: number[] = []
        for (let i = 0; i < 20; i++) replay.push(roll(20))
        clearSeed()
        const fresh: number[] = []
        for (let i = 0; i < 20; i++) fresh.push(roll(20))

        assert.equal(typeof seeded, 'number')
        assert.notEqual(replay.join(','), fresh.join(','))
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

    test('is independent from the global singleton', () => {
        const instance = createRoll(42)
        const beforeInstanceRoll = [instance.roll(20), instance.roll(20)]

        // seeding/rolling/clearing the global should not perturb the instance
        setSeed(1)
        roll(20)
        roll(20)
        clearSeed()

        const instanceReplay = createRoll(42)
        assert.deepEqual(
            [instanceReplay.roll(20), instanceReplay.roll(20)],
            beforeInstanceRoll,
        )

        // rolling on the instance should not perturb the global's sequence either
        setSeed(1)
        const globalFirst = [roll(20), roll(20)]
        clearSeed()

        instance.roll(20)
        instance.roll(20)

        setSeed(1)
        const globalSecond = [roll(20), roll(20)]
        clearSeed()

        assert.deepEqual(globalFirst, globalSecond)
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