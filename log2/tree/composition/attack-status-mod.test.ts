import { describe, test, expect } from 'vitest'
import attackStatusMod from './attack-status-mod'
import { createDefaultOwner } from '../../defaults'
import { leaf } from '../..'
import { StatusEffectMaximal } from '../types'
import { passesTags, weaponTags } from '../feats/gate'
import bullsStrength from '../bases/status/bulls-strength'

// LAYER: attack-status-mod is native now, a mirror of attack-feat-mod - it sums every status on owner.ss
// that declares an 'attack-status-mod' contribution. Each status gates itself on the weapon tags and
// returns undefined when it doesn't apply, leaving no leaf. Default mainhand is the shortsword
// (['shortsword','melee']).

// +2 attack, but only on a melee weapon
const meleeBless: StatusEffectMaximal = {
    displayName: 'Melee Bless',
    broadContexts: {
        'attack-status-mod': o => passesTags(weaponTags(o), ['melee'], []) ? leaf('Melee Bless', 2) : undefined,
    },
}

describe('attack-status-mod (native)', () => {
    test('an applying status becomes a summed child leaf', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { meleeBless } }))
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Melee Bless 2'])
    })

    test('tag filtering: a ranged-only status is skipped against the melee shortsword', () => {
        const rangedOnly: StatusEffectMaximal = {
            displayName: 'Ranged Only',
            broadContexts: {
                'attack-status-mod': o => passesTags(weaponTags(o), ['ranged'], []) ? leaf('Ranged Only', 2) : undefined,
            },
        }
        const node = attackStatusMod(createDefaultOwner({ ss: { rangedOnly } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('no statuses -> 0, no children', () => {
        const node = attackStatusMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a stat-boost status (no attack-status-mod contribution) contributes 0 here', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { bullsStrength } }))
        expect(node.total()).toBe(0)
    })
})
