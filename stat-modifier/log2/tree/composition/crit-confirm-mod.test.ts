import { describe, test, expect, assert } from 'vitest'
import critConfirmMod from './crit-confirm-mod'
import { createDefaultOwner } from '../../defaults'
import critFocus from '../feats/crit-focus'
import dodgy from '../feats/dodgy'
import modNodeToText from '../../format'
import { findNodeMatching } from '../..'

// LAYER: crit-confirm-mod is native, exactly like attack-feat-mod - it sums every feat on owner.fs that
// declares a 'crit-confirm-mod' contribution. A feat that declares a different broad context (or isn't
// on the sheet) leaves no child behind. crit-focus contributes a flat +4 unconditionally.

describe('crit-confirm-mod (native)', () => {
    test('crit-focus contributes a summed +4 child leaf', () => {
        const node = critConfirmMod(createDefaultOwner({
            fs: { critFocus },
        }))
        expect(node.total()).toBe(4)
        console.log(modNodeToText(node))
        const find = findNodeMatching(node, /crit\-focus/i)
        assert.exists(find)
    })

    test('no feats -> 0, no children', () => {
        const node = critConfirmMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a non crit-confirm feat does not leak into the crit confirm mod', () => {
        // dodgy declares only 'ac-feat-mod', so it is filtered out here entirely (not even a 0 leaf)
        const node = critConfirmMod(createDefaultOwner({ fs: { dodgy } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
