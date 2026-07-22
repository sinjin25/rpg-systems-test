import { describe, test, expect } from 'vitest'
import ac from './ac'
import catsGrace from '../bases/status/cats-grace'
import { asStatus } from '../composition/status/collect-status-contributions'
import { createDefaultOwner } from '../../../../defaults'
import { bandedMail, heavyShield } from '../../../../defaults/equipment'

// LAYER: ac (terminal) = base-ac + ac-from-dex + ac-of-equipment. Every child has its own suite, so
// this only proves the three are summed into the final answer. Cat's Grace is placed on the sheet.
//
// NB: totals differ from the legacy ac benchmark because rules are still missing - no Dodgy feat
// (+4), no Armor Training raising banded mail's cap from +1 to +2. The structure (base + dex +
// armor) is what this layer is responsible for.

describe('ac (terminal)', () => {
    test('armored: base 10 + capped dex 1 + armor 9', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail, offhand: heavyShield },
            ss: { catsGrace: asStatus(catsGrace) },
        })
        // 10 base + min(6 dex, 1 cap) + (7 + 2 armor)
        expect(ac(owner).total()).toBe(20)
    })

    test('unarmored: base 10 + full dex 6 + no armor', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            ss: { catsGrace: asStatus(catsGrace) },
        })
        // 10 base + 6 dex (uncapped) + 0 armor
        expect(ac(owner).total()).toBe(16)
    })
})
