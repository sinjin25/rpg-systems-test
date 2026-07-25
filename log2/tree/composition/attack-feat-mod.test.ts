import { describe, test, expect, assert } from 'vitest'
import attackFeatMod from './attack-feat-mod'
import { createDefaultOwner } from '../../defaults'
import { dagger } from '../../../../defaults/equipment'
import finesseWeaponFighting from '../feats/finesse-weapon-fighting'
import meleeWeaponFighting from '../feats/melee-weapon-fighting'
import dodgy from '../feats/dodgy'
import { modResultToNode } from '../../collect-status-contributions'
import modNodeToText from '../../format'
import { findNodeMatching } from '../..'

// LAYER: attack-feat-mod is native now - it sums every feat on owner.fs that declares an
// 'attack-feat-mod' contribution. Each feat gates itself on the weapon tags (mainhand stand-in) and
// returns undefined when it doesn't apply, so a gated-out feat leaves no child behind. Default mainhand
// is the shortsword (['shortsword','melee']). Native feats are placed on the sheet directly, under
// any (loose) string key.

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
        // dodgy declares only 'ac-feat-mod', so it is filtered out here entirely (not even a 0 leaf)
        const node = attackFeatMod(createDefaultOwner({ fs: { dodgy } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
