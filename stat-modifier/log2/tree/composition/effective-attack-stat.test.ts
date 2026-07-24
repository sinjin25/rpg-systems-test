import { describe, test, expect } from 'vitest'
import effectiveAttackStat from './effective-attack-stat'
import { createDefaultOwner } from '../../defaults'
import { dagger } from '../../../../defaults/equipment'
import modNodeToText from '../../format'
import { findNodeMatching } from '../..'

// LAYER: effective-attack-stat. Picks WHICH modded stat an attack uses based on the mainhand's
// tags - a finesse weapon offers str AND dex and maxFunc takes the better; everything else (and a
// bare hand) is str only. Trusts modded-str / modded-dex (each has its own suite); this only proves
// the selection.

// str high, dex low so the two branches are distinguishable
const owner = (extra = {}) => createDefaultOwner({ cs: { str: 20, dex: 10 }, ...extra })

describe('effective-attack-stat', () => {
    test('a non-finesse mainhand (default shortsword) uses str', () => {
        const result = effectiveAttackStat(owner())
        expect(result.total()).toBe(5) // str 20 -> +5
        expect(!!findNodeMatching(result, /str/i, {
            depth: 3,
        })).toBe(true)
    })

    test('a finesse mainhand (dagger) uses dex when dex is better', () => {
        const result = effectiveAttackStat(owner({ cs: { str: 10, dex: 16 }, es: { mainhand: dagger } }))
        expect(result.total()).toBe(3) // max(str 10 -> +0, dex 16 -> +3) = +3
        expect(!!findNodeMatching(result, /dex/i, {
            depth: 3,
        })).toBe(true)
    })

    test('a finesse mainhand still uses str when str is better (never a downgrade)', () => {
        // str 20 (+5), dex 10 (+0), dagger is finesse - the bug was forcing dex here
        const result = effectiveAttackStat(owner({ es: { mainhand: dagger } }))
        expect(result.total()).toBe(5) // max(str +5, dex +0) = +5
        expect(!!findNodeMatching(result, /str/i, { depth: 3 })).toBe(true)
    })

    test('no mainhand (unarmed) defaults to str', () => {
        expect(effectiveAttackStat(owner({ es: { mainhand: undefined } })).total()).toBe(5)
    })
})
