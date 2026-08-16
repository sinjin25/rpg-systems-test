import { describe, test, expect } from 'vitest'
import effectiveAttackStat from './effective-attack-stat'
import { createDefaultOwner } from '../../actor2'
import modNodeToText from '../format'
import { findNodeMatching, leaf } from '..'
import { BaseEquipment } from '../../equipment-sheet2/types'

const dagger: BaseEquipment = {
    displayName: 'dagger',
    broadContexts: {
        damage: (o) => {
            const r = 4
            return leaf('dagger', 4)
        }
    },
    tags: ['finesse', 'melee']
}
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
        const result = effectiveAttackStat(owner({ es: { mainhand: dagger } }))
        expect(result.total()).toBe(5) // max(str +5, dex +0) = +5
        expect(!!findNodeMatching(result, /str/i, { depth: 3 })).toBe(true)
    })

    test('no mainhand (unarmed) defaults to str', () => {
        expect(effectiveAttackStat(owner({ es: { mainhand: undefined } })).total()).toBe(5)
    })
})
