import { describe, test, assert } from 'vitest'
import { calculateAc } from '../../stat-modifier/ac/index.ts'
import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { divineProtectionStatus } from './divine-protection.ts'

describe('divineProtectionStatus', () => {
    test('adds the granted ac bonus', () => {
        const ss = {
            divineProtection: divineProtectionStatus({
                acBonus: 3,
                roundsRemaining: 2,
            })
        }
        const calc = calculateAc({
            cs: { ...defaultCharacterSheet, dex: 10 }, es: {}, fs: {}, ss,
        })
        // base 10 (dex 10 -> +0) + 3 from divine protection
        assert.equal(calc.total, 13)
    })

    test('expires via rounds-elapsed', () => {
        const status = divineProtectionStatus({
            acBonus: 3,
            roundsRemaining: 2,
        })
        assert.equal(status.expiration.kind, 'rounds-elapsed')
        assert.equal((status.expiration as any).remaining, 2)
    })
})
