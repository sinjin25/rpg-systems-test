import { describe, test, expect, assert } from 'vitest'
import critConfirm from './crit-confirm'
import { createDefaultOwner } from '../../actor2'
import critFocus from '../feats/crit-focus'
import { findNodeMatching } from '..'
import modNodeToText from '../format'
import { TerminalTags } from '../tags'
import { BaseEquipment } from '../types'

const shortsword: BaseEquipment = {
    displayName: 'shortsword',
    broadContexts: {

    },
    tags: ['melee']
}

describe('crit-confirm (terminal)', () => {
    test('adds the crit-confirm-mod child (crit-focus, +4) on top of the attack', () => {
        const node = critConfirm(createDefaultOwner({ fs: { critFocus } }))
        expect(node.total()).toBe(7) // attack 2 + crit-confirm-mod 4 + bab 1
        expect(node.children.length).toBe(2)
    })

    test('the crit-confirm-mod child is calcing correctly (+4 from crit-focus)', () => {
        const node = critConfirm(createDefaultOwner({ fs: { critFocus } }))
        const critConfirmMod = findNodeMatching(node, /crit\-confirm\-mod/i)
        expect(critConfirmMod?.total()).toBe(4)
        expect(findNodeMatching(critConfirmMod!, /crit\-focus/i)).toBeTruthy()
        /* console.log(modNodeToText(node)) */
    })

    test('without a confirm feat, the crit-confirm-mod child is 0 and the total is just the attack', () => {
        const node = critConfirm(createDefaultOwner({}))
        expect(node.total()).toBe(3) // attack 2 + crit-confirm-mod 0
        expect(findNodeMatching(node, /crit\-confirm\-mod/i)?.total()).toBe(0)
    })

    test('total is exactly the sum of its children (trusts them)', () => {
        const node = critConfirm(createDefaultOwner({ fs: { critFocus } }))
        const childSum = node.children.reduce((acc, c) => acc + c.total(), 0)
        expect(node.total()).toBe(childSum)
    })
})

describe('Confirm tag mutation (mutated at crit-confirm and attack)', () => {
    test('', () => {
        const o = createDefaultOwner()
        assert.equal(o.tags.length, 0)
        critConfirm(o)
        assert.equal(o.tags.length, 3)
        expect(o.tags).toEqual(expect.arrayContaining(['standard-attack', 'crit-confirm'] as TerminalTags[]))
    })
})
