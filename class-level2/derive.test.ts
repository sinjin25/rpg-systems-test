import { describe, test, expect } from 'vitest'
import { classLevelCounts, deriveBonus, featsFromLog, getNumberOfLevelupsAvailable, registry } from './derive'
import { ClassKeys, ClassLevelPickLog, ClassLevelSumKeys } from './types'
import { createDefaultExperience } from '../experience'
import { Experience } from '../experience/types'
import { FeatIds } from '../feat2/types'

const sumKeys: ClassLevelSumKeys[] = ['fortitude', 'reflex', 'attackBonus']

// n levels of a single class, no picks
const dip = (key: ClassKeys, n: number): ClassLevelPickLog =>
    Array.from({ length: n }, () => ({ key, freeFeats: [] }))

describe('registry', () => {
    test('every registered class is reachable under its own key', () => {
        for (const [key, cl] of Object.entries(registry)) {
            expect(cl.key).toEqual(key)
        }
    })

    // column lengths are checked in integrity.test.ts

    test('rogue grants no feats and offers no picks at any level', () => {
        const rogue = registry.rogue
        expect(rogue.classFeats.every((feats) => feats.length === 0)).toBe(true)
        expect(rogue.hasFreeFeats.every((slots) => slots.length === 0)).toBe(true)
    })
})

describe('deriveBonus: table slicing', () => {
    test('sums only as deep as the log goes', () => {
        // fighter attackBonus is [1,1,1,1,1]
        expect(deriveBonus(dip('fighter', 0), 'attackBonus').total()).toEqual(0)
        expect(deriveBonus(dip('fighter', 3), 'attackBonus').total()).toEqual(3)
    })

    test('a log exactly as deep as the table is allowed (boundary)', () => {
        const len = registry.fighter.fortitude.length
        expect(deriveBonus(dip('fighter', len), 'fortitude').total()).toEqual(3) // 1+0+1+0+1
    })

    test('throws past the end of the table rather than silently under-summing', () => {
        const len = registry.fighter.fortitude.length
        expect(() => deriveBonus(dip('fighter', len + 1), 'fortitude')).toThrow(/only defines/)
    })
})

describe('deriveBonus: single class', () => {
    const fighter3: ClassLevelPickLog = [
        { key: 'fighter', freeFeats: ['Rage'] },        // L1 offers a pick
        { key: 'fighter', freeFeats: [] },              // L2 does not
        { key: 'fighter', freeFeats: ['Battle Focus'] },// L3 offers a pick
    ]

    test('counts three fighter levels', () => {
        expect(classLevelCounts(fighter3)).toEqual({ fighter: 3 })
    })

    test('sums the first three rows of the fighter table', () => {
        expect(deriveBonus(fighter3, 'attackBonus').total()).toEqual(3) // 1+1+1
        expect(deriveBonus(fighter3, 'fortitude').total()).toEqual(2)   // 1+0+1
        expect(deriveBonus(fighter3, 'reflex').total()).toEqual(1)      // 0+0+1
    })

    test('collects class grants and picks in acquisition order', () => {
        expect(featsFromLog(fighter3)).toEqual([
            'Martial Proficiency', // fighter 1 grant
            'Shield Proficiency', // fighter 1 grant
            'Rage',                // fighter 1 pick
            'Hardy',               // fighter 2 grant
            'Power Attack',        // fighter 3 grant
            'Armor Training',      // fighter 3 grant
            'Battle Focus',        // fighter 3 pick
        ])
    })
})

describe('deriveBonus: multiclass', () => {
    // fighter 2 / rogue 1, taken in that order
    const mixed: ClassLevelPickLog = [
        { key: 'fighter', freeFeats: ['Rage'] },
        { key: 'fighter', freeFeats: [] },
        { key: 'rogue', freeFeats: [] },
    ]

    test('counts each class separately', () => {
        expect(classLevelCounts(mixed)).toEqual({ fighter: 2, rogue: 1 })
    })

    test('each class contributes only its own slice', () => {
        // fighter [1,1] + rogue [0]
        expect(deriveBonus(mixed, 'attackBonus').total()).toEqual(2)
        // fighter [1,0] + rogue [0]
        expect(deriveBonus(mixed, 'fortitude').total()).toEqual(1)
        // fighter [0,0] + rogue [2] - the rogue dip is where reflex comes from
        expect(deriveBonus(mixed, 'reflex').total()).toEqual(2)
    })

    test('one leaf per class, in first-appearance order', () => {
        const node = deriveBonus(mixed, 'attackBonus')
        expect(node.children.map((c) => [c.displayName, c.total()])).toEqual([
            ['fighter', 2],
            ['rogue', 0],
        ])
    })

    test('the rogue level adds no feats', () => {
        expect(featsFromLog(mixed)).toEqual([
            'Martial Proficiency',
            'Shield Proficiency',
            'Rage',
            'Hardy',
        ] as FeatIds[])
    })

    // the whole point of a log: order of acquisition must not change the totals
    test('interleaving the same levels gives the same sums', () => {
        const interleaved: ClassLevelPickLog = [
            { key: 'fighter', freeFeats: ['Rage'] },
            { key: 'rogue', freeFeats: [] },
            { key: 'fighter', freeFeats: [] },
        ]
        for (const key of sumKeys) {
            expect(deriveBonus(interleaved, key).total()).toEqual(deriveBonus(mixed, key).total())
        }
    })

    test('a rogue-first dip pulls from the rogue table, not the fighter one', () => {
        // rogue 1 alone: reflex +2, attack +0
        const rogue1: ClassLevelPickLog = [{ key: 'rogue', freeFeats: [] }]
        expect(deriveBonus(rogue1, 'reflex').total()).toEqual(2)
        expect(deriveBonus(rogue1, 'attackBonus').total()).toEqual(0)
        expect(featsFromLog(rogue1)).toEqual([])
    })
})

describe('getNumberOfLevelupsAvailable', () => {
    // breakpoints are [10, 50, 200, 400, 700, 1000, 9999999]
    // clpl is always at least 1 entry here — a real character is never level 0
    // (createDefaultOwner seeds one level on creation), and currLevel is 1-indexed
    // against that: level 1 has spent 0 thresholds, level n has spent n-1 of them.
    const exp = (currentXp: number): Experience => ({ ...createDefaultExperience(), currentXp })

    test('Start at level 1, w/o a level up available', () => {
        expect(getNumberOfLevelupsAvailable(exp(0), dip('fighter', 1))).toEqual(0)
    })

    test('Under xp breakpoint behavior', () => {
        expect(getNumberOfLevelupsAvailable(exp(9), dip('fighter', 1))).toEqual(0)
    })

    test('>= breakpoint', () => {
        expect(getNumberOfLevelupsAvailable(exp(10), dip('fighter', 1))).toEqual(1)
    })

    test('>= multiple breakpoints', () => {
        // clears 10/50/200 - 3 thresholds, 0 spent at level 1
        expect(getNumberOfLevelupsAvailable(exp(300), dip('fighter', 1))).toEqual(3)
    })

    test('>= multiple breakpoints w/ levels spent', () => {
        // 3 thresholds cleared, 1 spent (again start at level 1, not 0)
        expect(getNumberOfLevelupsAvailable(exp(300), dip('fighter', 2))).toEqual(2)
    })

    // this might happen if breakpoints were modified mid run (although breakpoints are serialized so this actually wouldn't happen but w/e)
    test('Safety clamp - more levels than normal', () => {
        // 10/50/200/400/700/1000 - 6 thresholds clear, so level 7 is attainable
        expect(getNumberOfLevelupsAvailable(exp(1000), dip('fighter', 7))).toEqual(0)
        expect(getNumberOfLevelupsAvailable(exp(1000), dip('fighter', 99))).toEqual(0)
    })
})

describe('deriveBonus: empty log', () => {
    test('a level 0 character sums to nothing', () => {
        for (const key of sumKeys) {
            const node = deriveBonus([], key)
            expect(node.total()).toEqual(0)
            expect(node.children).toEqual([])
        }
        expect(featsFromLog([])).toEqual([])
        expect(classLevelCounts([])).toEqual({})
    })
})
