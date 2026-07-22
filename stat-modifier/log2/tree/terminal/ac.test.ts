import { describe, test, expect } from 'vitest'
import ac from './ac'
import catsGrace from '../bases/status/cats-grace'
import { createDefaultOwner } from '../../defaults'
import { bandedMail, heavyShield } from '../../../../defaults/equipment'
import { asStatus } from '../../collect-status-contributions'
import dodgy from '../feats/dodgy'
import shieldMastery from '../feats/shield-mastery'

// LAYER: ac (terminal) = base-ac + ac-from-dex + ac-of-equipment + ac-feat-mod. Every child has its
// own suite, so this only proves they are summed into the final answer. Cat's Grace is placed on the
// sheet; native feats are placed directly on the feat sheet (no cast).
//
// NB: totals still differ from the legacy ac benchmark in the no-feat cases because a rule is missing
// - no Armor Training raising banded mail's cap from +1 to +2. The structure (base + dex + armor +
// feats) is what this layer is responsible for.

describe('ac (terminal)', () => {
    test('armored: base 10 + capped dex 1 + armor 9', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail, offhand: heavyShield },
            ss: { catsGrace: asStatus(catsGrace) },
        })
        // 10 base + min(4 dex, 1 cap) + (7 + 2 armor)
        expect(ac(owner).total()).toBe(20)
    })

    test('unarmored: base 10 + full dex 4 + no armor', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            ss: { catsGrace: asStatus(catsGrace) },
        })
        // 10 base + 4 dex (14 + 4 -> +4, uncapped) + 0 armor
        expect(ac(owner).total()).toBe(14)
    })

    test('feats fold in: Dodgy (+4) and Shield Mastery (+1 with a shield)', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail, offhand: heavyShield },
            ss: { catsGrace: asStatus(catsGrace) },
            fs: { dodgy, shieldMastery },
        })
        // armored 20 (from the first case) + Dodgy 4 + Shield Mastery 1
        expect(ac(owner).total()).toBe(25)
    })
})
