import { describe, test, expect } from 'vitest'
import ac from './ac'
import catsGrace from '../bases/status/cats-grace'
import divineProtection from '../bases/status/divine-protection'
import { createDefaultOwner } from '../defaults'
import { bandedMail, heavyShield } from '../../defaults/equipment'
import dodgy from '../feats/dodgy'
import shieldMastery from '../feats/shield-mastery'
import { modLogToText } from '../../stat-modifier/log/format'
import modNodeToText from '../format'

describe('ac (terminal)', () => {
    test('armored: base 10 + capped dex 1 + armor 9', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail, offhand: heavyShield },
            ss: { catsGrace },
        })
        // 10 base + min(4 dex, 1 cap) + (7 + 2 armor)
        expect(ac(owner).total()).toBe(20)
    })

    test('unarmored: base 10 + full dex 4 + no armor', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            ss: { catsGrace },
        })
        // 10 base + 4 dex (14 + 4 -> +4, uncapped) + 0 armor
        expect(ac(owner).total()).toBe(14)
    })

    test('feats fold in: Dodgy (+4) and Shield Mastery (+1 with a shield)', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail, offhand: heavyShield },
            ss: { catsGrace },
            fs: { dodgy, shieldMastery },
        })
        // armored 20 (from the first case) + Dodgy 4 + Shield Mastery 1
        const result = ac(owner)
        expect(result.total()).toBe(25)
        console.log(modNodeToText(result))
    })

    test('an AC status folds in: Divine Protection (+2)', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail, offhand: heavyShield },
            ss: { catsGrace, divineProtection: divineProtection(2) },
        })
        // armored 20 (from the first case) + Divine Protection 2
        expect(ac(owner).total()).toBe(22)
    })
})
