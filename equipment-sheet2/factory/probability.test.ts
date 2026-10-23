import { describe, test } from 'vitest'
import { weaponAffixLookupTable } from './tables/weapon'

const toPercent = (part: number, whole: number) => (part / whole) * 100

describe('weapon affix probability', () => {
    test('distribution of affix kinds', () => {
        const totalWeight = Object.values(weaponAffixLookupTable)
            .flat()
            .reduce((sum, rank) => sum + rank.weight, 0)

        const table: Record<string, { percent: string }> = {}
        for (const [kind, ranks] of Object.entries(weaponAffixLookupTable)) {
            const kindWeight = ranks.reduce((sum, rank) => sum + rank.weight, 0)
            table[kind] = { percent: `${toPercent(kindWeight, totalWeight).toFixed(2)}%` }
        }

        console.table(table)
    })

    test('distribution of affix ranks per kind', () => {
        // one roll across every (kind, rank) pair's weight, same as rollCardReward/
        // rollResourceReward — a single total, not a per-kind total
        const totalWeight = Object.values(weaponAffixLookupTable)
            .flat()
            .reduce((sum, rank) => sum + rank.weight, 0)

        const table: Record<string, { min: number, max: number, percent: string }> = {}
        for (const [kind, ranks] of Object.entries(weaponAffixLookupTable)) {
            ranks.forEach((rank, index) => {
                table[`${kind} rank ${index}`] = {
                    min: rank.min,
                    max: rank.max,
                    percent: `${toPercent(rank.weight, totalWeight).toFixed(2)}%`,
                }
            })
        }

        console.table(table)
    })
})
