import { describe, test, expect } from 'vitest'
import { classLevelCounts, deriveBonus, featsFromLog, registry } from './derive'
import { ClassKeys, ClassLevelPickLog, ClassLevelSumKeys } from './types'

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
        expect(rogue.hasFreeFeats.every((offers) => offers === false)).toBe(true)
    })
})

describe('deriveBonus: table slicing', () => {
    test('sums only as deep as the log goes', () => {
        // fighter attackBonus is [1,1,1,1,1]
        expect(deriveBonus(dip('fighter', 0), 'attackBonus')).toEqual(0)
        expect(deriveBonus(dip('fighter', 3), 'attackBonus')).toEqual(3)
    })

    test('a log exactly as deep as the table is allowed (boundary)', () => {
        const len = registry.fighter.fortitude.length
        expect(deriveBonus(dip('fighter', len), 'fortitude')).toEqual(3) // 1+0+1+0+1
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
        expect(deriveBonus(fighter3, 'attackBonus')).toEqual(3) // 1+1+1
        expect(deriveBonus(fighter3, 'fortitude')).toEqual(2)   // 1+0+1
        expect(deriveBonus(fighter3, 'reflex')).toEqual(1)      // 0+0+1
    })

    test('collects class grants and picks in acquisition order', () => {
        expect(featsFromLog(fighter3)).toEqual([
            'Improved Initiative', // fighter 1 grant
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
        expect(deriveBonus(mixed, 'attackBonus')).toEqual(2)
        // fighter [1,0] + rogue [0]
        expect(deriveBonus(mixed, 'fortitude')).toEqual(1)
        // fighter [0,0] + rogue [2] - the rogue dip is where reflex comes from
        expect(deriveBonus(mixed, 'reflex')).toEqual(2)
    })

    test('the rogue level adds no feats', () => {
        expect(featsFromLog(mixed)).toEqual([
            'Improved Initiative',
            'Rage',
            'Hardy',
        ])
    })

    // the whole point of a log: order of acquisition must not change the totals
    test('interleaving the same levels gives the same sums', () => {
        const interleaved: ClassLevelPickLog = [
            { key: 'fighter', freeFeats: ['Rage'] },
            { key: 'rogue', freeFeats: [] },
            { key: 'fighter', freeFeats: [] },
        ]
        for (const key of sumKeys) {
            expect(deriveBonus(interleaved, key)).toEqual(deriveBonus(mixed, key))
        }
    })

    test('a rogue-first dip pulls from the rogue table, not the fighter one', () => {
        // rogue 1 alone: reflex +2, attack +0
        const rogue1: ClassLevelPickLog = [{ key: 'rogue', freeFeats: [] }]
        expect(deriveBonus(rogue1, 'reflex')).toEqual(2)
        expect(deriveBonus(rogue1, 'attackBonus')).toEqual(0)
        expect(featsFromLog(rogue1)).toEqual([])
    })
})

describe('deriveBonus: empty log', () => {
    test('a level 0 character sums to nothing', () => {
        for (const key of sumKeys) expect(deriveBonus([], key)).toEqual(0)
        expect(featsFromLog([])).toEqual([])
        expect(classLevelCounts([])).toEqual({})
    })
})
