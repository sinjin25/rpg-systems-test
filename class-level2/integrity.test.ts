import { describe, test, expect } from 'vitest'
import { registry } from './derive'
import { ClassLevel } from './types'
import possibleFeats from '../feat2/feats'

const columnLengths = (cl: ClassLevel): Record<string, number> =>
    Object.fromEntries(
        Object.entries(cl)
            .filter(([, v]) => Array.isArray(v))
            .map(([name, v]) => [name, (v as unknown[]).length]),
    )

describe('class table integrity', () => {
    for (const [registryKey, cl] of Object.entries(registry)) {
        describe(registryKey, () => {
            const lengths = columnLengths(cl)
            const max = Math.max(...Object.values(lengths))

            test('defines at least one level', () => {
                expect(Object.keys(lengths).length).toBeGreaterThan(0)
                expect(max).toBeGreaterThan(0)
            })

            test(`every column is ${max} long`, () => {
                const expected = Object.fromEntries(Object.keys(lengths).map((name) => [name, max]))
                expect(lengths).toEqual(expected)
            })
        })
    }
})
describe('class tables only grant feats that exist', () => {
    for (const [registryKey, cl] of Object.entries(registry)) {
        describe(registryKey, () => {
            const granted = (cl as ClassLevel).classFeats

            granted.forEach((featsAtLevel, index) => {
                if (featsAtLevel.length === 0) return
                test(`level ${index + 1} grants ${featsAtLevel.join(', ')}`, () => {
                    const missing = featsAtLevel.filter((feat) => !(feat in possibleFeats))
                    expect(missing).toEqual([])
                })
            })

            test('grants at least one known feat somewhere, or none at all', () => {
                const total = granted.reduce((n, feats) => n + feats.length, 0)
                const known = granted
                    .flat()
                    .filter((feat) => feat in possibleFeats).length
                expect(known).toEqual(total)
            })
        })
    }
})
