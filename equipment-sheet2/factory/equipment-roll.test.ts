import { describe, expect, test, vi, assert } from 'vitest'
import { rollPerfection, rollRank, rollMod, rollBaseItem } from './equipment-roll'
import { createRoll } from '../../roll'
import { getModsBySlot } from './util'

describe.skip('eyeball implicit distribution', () => {
    test('log distribution', () => {
        const ri = createRoll(0)
        const counts: Record<string, number> = {}
        for (let i = 0; i < 1000; i++) {
            const item = rollBaseItem('mainhand', ri)
            if (!item) continue
            counts[item.name] = (counts[item.name] ?? 0) + 1
        }
        console.log(counts)
    })
})

// seed fishing: locates seeds whose RollInstance.roll(101) lands on 1 (perfection 0)
// and 101 (perfection 100). Found seed 35 -> 1, seed 43 -> 101. Rearm if these break.
describe.skip('fish for rollPerfection edge-case seeds', () => {
    test('find seeds', () => {
        let seedForMin = -1
        let seedForMax = -1
        for (let seed = 0; seed < 100_000; seed++) {
            const roll = createRoll(seed).roll(101)
            if (roll === 1 && seedForMin === -1) seedForMin = seed
            if (roll === 101 && seedForMax === -1) seedForMax = seed
            if (seedForMin !== -1 && seedForMax !== -1) break
        }
        console.log({ seedForMin, seedForMax })
    })
})

describe('rollPerfection', () => {
    test('with a RollInstance, can roll both 0 and 100', () => {
        expect(rollPerfection(createRoll(35))).toBe(0)
        expect(rollPerfection(createRoll(43))).toBe(100)
    })

    test('without a RollInstance, can roll both 0 and 100', () => {
        const randomSpy = vi.spyOn(Math, 'random')

        randomSpy.mockReturnValueOnce(0)
        expect(rollPerfection()).toBe(0)

        randomSpy.mockReturnValueOnce(0.999999)
        expect(rollPerfection()).toBe(100)

        randomSpy.mockRestore()
    })
})

describe('rollRank distribution', () => {
    test('distribution of ranks over 1000 rolls', () => {
        const ri = createRoll(0)

        const lookup = { slot: 'mainhand' as const, position: 'affix' as const, modName: 'attack' as const }

        const counts: Record<number, number> = {}
        for (let i = 0; i < 1000; i++) {
            const rank = rollRank(lookup, ri)
            if (rank === undefined) continue
            counts[rank] = (counts[rank] ?? 0) + 1
        }

        /* const table: Record<string, { count: number }> = {}
        for (const [rank, count] of Object.entries(counts)) {
            table[`rank ${rank}`] = { count }
        } */

        assert.equal(counts[3], 444)
    })
})

describe('rollBaseItem', () => {
    test('rolls a base item proportional to weight across the mainhand table', () => {
        const ri = createRoll(0)

        const counts: Record<string, number> = {}
        for (let i = 0; i < 1000; i++) {
            const item = rollBaseItem('mainhand', ri)
            if (!item) continue
            counts[item.name] = (counts[item.name] ?? 0) + 1
        }

        assert.equal(counts['longsword'], 186)
    })

    test('returns undefined for a slot with no base item table', () => {
        expect(rollBaseItem('offhand', createRoll(0))).toBeUndefined()
    })
})

describe('rollMod', () => {
    test('rolls a mod proportional to total weight across every (kind, rank) pair', () => {
        const ri = createRoll(0)
        const lookup = { slot: 'mainhand' as const, position: 'affix' as const }

        const counts: Record<string, number> = {}
        for (let i = 0; i < 1000; i++) {
            const mod = rollMod(lookup, ri)
            if (mod === undefined) continue
            counts[mod] = (counts[mod] ?? 0) + 1
        }

        assert.equal(counts['attack'], 285)
    })

    test.skip('spot check log', () => {
        const lookup = { slot: 'mainhand' as const, position: 'affix' as const }
        const mods = getModsBySlot(lookup.slot, lookup.position)

        const counts: Record<string, number> = {}
        for (let i = 0; i < 1000; i++) {
            const mod = rollMod(lookup)
            if (mod === undefined) continue
            counts[mod] = (counts[mod] ?? 0) + 1
        }

        const table: Record<string, { frequency: number, weight: number }> = {}
        for (const [modName, ranks] of Object.entries(mods)) {
            table[modName] = {
                frequency: counts[modName] ?? 0,
                weight: ranks.reduce((sum, rank) => sum + rank.weight, 0),
            }
        }

        console.table(table)
    })
})
