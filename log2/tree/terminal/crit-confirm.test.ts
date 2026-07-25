import { describe, test, expect } from 'vitest'
import critConfirm from './crit-confirm'
import { createDefaultOwner } from '../../defaults'
import critFocus from '../feats/crit-focus'
import { findNodeMatching } from '../..'
import modNodeToText from '../../format'

// LAYER: crit-confirm (terminal). Sums two children - the full attack roll and the crit-confirm-mod.
// Both have their own suites, so this proves the assembly: that the crit-confirm-mod child is wired in
// and lands in the total. Default character's attack is +2 (str 15 -> +2, everything else 0); crit-focus
// contributes +4 through crit-confirm-mod, so a confirm build totals 6.

describe('crit-confirm (terminal)', () => {
    test('adds the crit-confirm-mod child (crit-focus, +4) on top of the attack', () => {
        const node = critConfirm(createDefaultOwner({ fs: { critFocus } }))
        expect(node.total()).toBe(6) // attack 2 + crit-confirm-mod 4
        expect(node.children.length).toBe(2)
    })

    test('the crit-confirm-mod child is calcing correctly (+4 from crit-focus)', () => {
        const node = critConfirm(createDefaultOwner({ fs: { critFocus } }))
        const critConfirmMod = findNodeMatching(node, /crit\-confirm\-mod/i)
        expect(critConfirmMod?.total()).toBe(4)
        expect(findNodeMatching(critConfirmMod!, /crit\-focus/i)).toBeTruthy()
        console.log(modNodeToText(node))
    })

    test('without a confirm feat, the crit-confirm-mod child is 0 and the total is just the attack', () => {
        const node = critConfirm(createDefaultOwner({}))
        expect(node.total()).toBe(2) // attack 2 + crit-confirm-mod 0
        expect(findNodeMatching(node, /crit\-confirm\-mod/i)?.total()).toBe(0)
    })

    test('total is exactly the sum of its children (trusts them)', () => {
        const node = critConfirm(createDefaultOwner({ fs: { critFocus } }))
        const childSum = node.children.reduce((acc, c) => acc + c.total(), 0)
        expect(node.total()).toBe(childSum)
    })
})
