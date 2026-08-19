import { describe, test, expect, assert } from 'vitest'
import acFromDex from './ac-from-dex'
import catsGrace from '../../../status-sheet2/status/cats-grace'
import { createDefaultOwner } from '../../../actor2'
import { inst } from '../../../status-sheet2/testing'
import { armors } from '../../../equipment-sheet2/defaults'

describe('ac-from-dex', () => {
    test('the armor cap clamps a higher dex', () => {
        // dex 14 + Cat's Grace 4 -> modded-dex +4, banded mail caps at +1
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            es: { armor: armors['banded mail'] },
            ss: { catsGrace: [inst(catsGrace)] },
        })
        expect(acFromDex(owner).total()).toBe(1)
    })

    test('with no armor, dex passes through uncapped', () => {
        const owner = createDefaultOwner({
            cs: { dex: 14 },
            ss: { catsGrace: [inst(catsGrace)] },
        })
        expect(acFromDex(owner).total()).toBe(4) // full modded-dex (14 + 4 -> +4), no cap in play
    })
})

describe('ac-from-dex past issues', () => {
    test('with no armor, does not pass an undefined max dex node', () => {
        const owner = createDefaultOwner({})
        assert.equal(owner.es.armor, undefined)
        const node = acFromDex(owner)
        for (let n of node.children) {
            assert.exists(n)
        }
    })
})
