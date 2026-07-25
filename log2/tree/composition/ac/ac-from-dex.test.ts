import { describe, test, expect } from 'vitest'
import acFromDex from './ac-from-dex'
import catsGrace from '../../bases/status/cats-grace'
import { createDefaultOwner } from '../../../defaults'
import { bandedMail } from '../../../../defaults/equipment'

describe('ac-from-dex', () => {
    test('the armor cap clamps a higher dex', () => {
        // dex 14 + Cat's Grace 4 -> modded-dex +4, banded mail caps at +1
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: bandedMail },
            ss: { catsGrace },
        })
        expect(acFromDex(owner).total()).toBe(1)
    })

    test('with no armor, dex passes through uncapped', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            ss: { catsGrace },
        })
        expect(acFromDex(owner).total()).toBe(4) // full modded-dex (14 + 4 -> +4), no cap in play
    })
})
