import { describe, test, expect, assert } from 'vitest'
import moddedCsScore from './modded-cs-score'
import catsGrace from '../../status-sheet2/status/cats-grace'
import bullsStrength from '../../status-sheet2/status/bulls-strength'
import bearsEndurance from '../../status-sheet2/status/bears-endurance'
import { createDefaultOwner } from '../../actor2'
import { dexAmulet, strAmulet } from './equipment/demo-equips'
import { findNodeMatching } from '..'
import { CsScore } from '../types'
import { StatusEffectWrapper } from '../../status-sheet2'
import { inst } from '../../status-sheet2/testing'
import { BaseEquipment } from '../../equipment-sheet2/types'

describe('Works', () => {
    test('Confirm name', () => {
        const owner = createDefaultOwner({})
        const result = moddedCsScore('dex')(owner)
        findNodeMatching(result, /dex-total/, {
            includeRoot: true,
        })
    })
})

type Case = {
    member: CsScore,
    status: StatusEffectWrapper,
    amulet?: BaseEquipment,
    amuletName?: RegExp,
}

const cases: Case[] = [
    { member: 'dex', status: catsGrace, amulet: dexAmulet, amuletName: /dex amulet/i },
    { member: 'str', status: bullsStrength, amulet: strAmulet, amuletName: /str amulet/i },
    { member: 'con', status: bearsEndurance },
]

describe.each(cases)('modded-cs-score: $member', ({ member, status, amulet, amuletName }) => {
    const mod = (score: number, extra = {}) =>
        moddedCsScore(member)(createDefaultOwner({ cs: { [member]: score }, ...extra })).total()

    test('sums the status score bonus before converting to a modifier', () => {
        const withStatus = (score: number) => mod(score, { ss: { [member]: [inst(status)] } })
        expect(withStatus(14)).toBe(4) // (14 + 4) -> +4
        expect(withStatus(10)).toBe(2) // (10 + 4) -> +2
    })

    test('with no statuses, it is just the raw score converted to a modifier', () => {
        expect(mod(14)).toBe(2)
        expect(mod(10)).toBe(0)
    })

    // the stat->modifier rounding lives here (raw-cs-score just reports the score)
    test('rounds toward zero: odd scores round down, negatives round toward zero', () => {
        expect(mod(15)).toBe(2)       // mod 5 -> 2.5 -> 2
        expect(mod(9) === 0).toBe(true) // -0.5 rounds toward zero (-0, which === 0)
        expect(mod(8)).toBe(-1)
        expect(mod(7)).toBe(-1)       // -1.5 -> -1, not -2
    })

    test('names its root node so callers can find it by the old name', () => {
        expect(moddedCsScore(member)(createDefaultOwner()).displayName).toBe(`modded-${member}`)
    })

    test.runIf(amulet)('Can factor in equipment', () => {
        const owner = createDefaultOwner({
            cs: { [member]: 16 },
            es: { amulet },
        })

        const result = moddedCsScore(member)(owner)
        expect(result.total()).toBe(4) // (16 + 2) -> +4
        assert.exists(findNodeMatching(result, amuletName!))
    })
})
