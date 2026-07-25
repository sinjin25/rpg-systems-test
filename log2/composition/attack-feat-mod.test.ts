import { describe, test, expect, assert } from 'vitest'
import attackFeatMod from './attack-feat-mod'
import { createDefaultOwner } from '../defaults'
import { dagger } from '../../defaults/equipment'
import finesseWeaponFighting from '../feats/finesse-weapon-fighting'
import meleeWeaponFighting from '../feats/melee-weapon-fighting'
import dodgy from '../feats/dodgy'
import { modResultToNode } from '../collect-status-contributions'
import modNodeToText from '../format'
import { findNodeMatching } from '..'

describe('attack-feat-mod (native)', () => {
    test('an applying feat becomes a summed child leaf', () => {
        // Melee Weapon Fighting whitelists 'melee'; the default shortsword is melee
        const node = attackFeatMod(createDefaultOwner({
            fs: { meleeWeaponFighting },
        }))
        expect(node.total()).toBe(1)
        console.log(modNodeToText(node))
        const find = findNodeMatching(node, /weapon\-fighting/i)
        assert.exists(find)
    })

    test('weapon-tag gating: a finesse feat applies with a dagger, not a shortsword', () => {
        const withDagger = attackFeatMod(createDefaultOwner({
            fs: { finesseWeaponFighting }, es: { mainhand: dagger },
        }))
        expect(withDagger.total()).toBe(1) // dagger carries 'finesse'

        const withShortsword = attackFeatMod(createDefaultOwner({
            fs: { finesseWeaponFighting },
        }))
        expect(withShortsword.total()).toBe(0) // present but gated out -> no child at all
        expect(withShortsword.children).toEqual([])
    })

    test('no feats -> 0, no children', () => {
        const node = attackFeatMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('an AC-only feat does not leak into the attack feat mod', () => {
        const node = attackFeatMod(createDefaultOwner({ fs: { dodgy } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
