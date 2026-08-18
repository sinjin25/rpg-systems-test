import { describe, test, expect, assert } from 'vitest'
import ac from './ac'
import catsGrace from '../../status-sheet2/status/cats-grace'
import divineProtection from '../../status-sheet2/status/divine-protection'
import { createDefaultOwner } from '../../actor2'
import { inst } from '../../status-sheet2/testing'
import dodgy from '../feats/dodgy'
import shieldMastery from '../feats/shield-mastery'
import modNodeToText from '../format'
import { armors, heavyShield } from '../../equipment-sheet2/defaults'

describe('ac (terminal)', () => {
    test('mutates owner tags', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: armors['banded mail'], offhand: heavyShield },
            ss: { catsGrace: [inst(catsGrace)] },
            fs: { dodgy, shieldMastery },
        })
        assert.equal(owner.tags.length, 0)
        ac(owner)
        assert.equal(owner.tags.length > 0, true)
    })
    test('armored: base 10 + capped dex 1 + armor 9', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: armors['banded mail'], offhand: heavyShield },
            ss: { catsGrace: [inst(catsGrace)] },
        })
        // 10 base + min(4 dex, 1 cap) + (7 + 2 armor)
        const node = ac(owner)
        /* console.log(modNodeToText(node)) */
        expect(node.total()).toBe(20)
    })

    test('unarmored: base 10 + full dex 4 + no armor', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            ss: { catsGrace: [inst(catsGrace)] },
        })
        const node = ac(owner)
        // 10 base + 4 dex (14 + 4 -> +4, uncapped) + 0 armor
        expect(node.total()).toBe(14)
    })

    test('Tags are passed properly and feats are included when relevant (+4, +1)', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: armors['banded mail'], offhand: heavyShield },
            ss: { catsGrace: [inst(catsGrace)] },
            fs: { dodgy, shieldMastery },
        })
        const node = ac(owner)
        /* console.log(modNodeToText(node)) */
        // armored 20 (from the first case) + Dodgy 4 + Shield Mastery 1
        expect(node.total()).toBe(25)
        /* console.log(modNodeToText(result)) */
    })

    test('an AC status folds in: Divine Protection (+2)', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: armors['banded mail'], offhand: heavyShield },
            ss: { catsGrace: [inst(catsGrace)], divineProtection: [inst(divineProtection(2))] },
        })
        // armored 20 (from the first case) + Divine Protection 2
        expect(ac(owner).total()).toBe(22)
    })
})
