import { describe, test, expect, assert } from 'vitest'
import critConfirmMod from './crit-confirm-mod'
import { createDefaultOwner } from '../../actor2'
import critFocus from '../../feat2/feats/crit-focus'
import dodge from '../../feat2/feats/dodge'
import modNodeToText from '../format'
import { findNodeMatching } from '..'

describe('crit-confirm-mod (native)', () => {
    test('crit-focus contributes a summed +4 child leaf', () => {
        const node = critConfirmMod(createDefaultOwner({
            fs: { critFocus },
        }))
        expect(node.total()).toBe(4)
        /* console.log(modNodeToText(node)) */
        const find = findNodeMatching(node, /crit focus/i)
        assert.exists(find)
    })

    test('no feats -> 0, no children', () => {
        const node = critConfirmMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a non crit-confirm feat does not leak into the crit confirm mod', () => {
        const node = critConfirmMod(createDefaultOwner({ fs: { dodge } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
