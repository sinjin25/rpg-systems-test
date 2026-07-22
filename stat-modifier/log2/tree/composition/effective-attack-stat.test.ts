import { describe, test, expect } from 'vitest'
import effectiveAttackStat from './effective-attack-stat'
import { createDefaultOwner } from '../../defaults'
import { dagger } from '../../../../defaults/equipment'
import modNodeToText from '../../format'
import { findNodeMatching } from '../..'

// LAYER: effective-attack-stat. Picks WHICH modded stat an attack uses based on the mainhand's
// tags - dex for a finesse weapon, str otherwise (and str when unarmed). Trusts modded-str /
// modded-dex (each has its own suite); this only proves the selection.

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

    test('a finesse mainhand (dagger) uses dex', () => {
        const result = effectiveAttackStat(owner({ cs: { dex: 16 }, es: { mainhand: dagger } }))
        expect(result.total()).toBe(3) // dex 16 -> +3
        expect(!!findNodeMatching(result, /dex/i, {
            depth: 3,
        })).toBe(true)
    })

    test('no mainhand (unarmed) defaults to str', () => {
        expect(effectiveAttackStat(owner({ es: { mainhand: undefined } })).total()).toBe(5)
    })
})
