import { describe, test, expect } from 'vitest'
import attackFeatMod from './attack-feat-mod'
import { createDefaultOwner } from '../../../../defaults'
import { dagger } from '../../../../defaults/equipment'
import { featMeleeWeaponFighting, featFinesseWeaponFighting } from '../../../../feat/feats'
import bullsStrength from '../bases/status/bulls-strength'
import { asStatus } from '../../collect-status-contributions'

// LAYER: attack-feat-mod bridges to the legacy context-tag engine. It trusts calculateFeatMod's
// filtering; these tests prove the bridge wires tags from the mainhand and turns each applying feat
// into a child leaf. Default mainhand is the shortsword (['shortsword','melee']).

describe('attack-feat-mod', () => {
    test('an applying feat becomes a summed child leaf', () => {
        // Melee Weapon Fighting whitelists 'melee'; the default shortsword is melee
        const node = attackFeatMod(createDefaultOwner({ fs: { featMeleeWeaponFighting } }))
        expect(node.total()).toBe(1)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['DEMO Melee Weapon Fighting 1'])
    })

    test('tag filtering: a finesse-only feat applies with a dagger, not a shortsword', () => {
        // Finesse Weapon Fighting whitelists 'finesse'
        const withDagger = attackFeatMod(createDefaultOwner({
            fs: { featFinesseWeaponFighting }, es: { mainhand: dagger },
        }))
        expect(withDagger.total()).toBe(1) // dagger carries 'finesse'

        const withShortsword = attackFeatMod(createDefaultOwner({ fs: { featFinesseWeaponFighting } }))
        expect(withShortsword.total()).toBe(0) // shortsword has no 'finesse' tag
        expect(withShortsword.children).toEqual([])
    })

    test('no feats -> 0, no children', () => {
        const node = attackFeatMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a log2 stat-boost status does not leak into feat mod', () => {
        const node = attackFeatMod(createDefaultOwner({ ss: { bullsStrength: asStatus(bullsStrength) } }))
        expect(node.total()).toBe(0)
    })
})
