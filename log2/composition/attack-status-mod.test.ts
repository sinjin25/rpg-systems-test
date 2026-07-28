import { describe, test, expect } from 'vitest'
import attackStatusMod from './attack-status-mod'
import { createDefaultOwner } from '../defaults'
import { leaf } from '..'
import { passesTags, weaponTags } from '../feats/gate'
import bullsStrength from '../bases/status/bulls-strength'
import { ObjectWithBroadContexts } from '../types'
import { hasAllTags, mutateOwnerTags } from '../tags'

// +2 attack, but only on a melee weapon
const meleeBless: ObjectWithBroadContexts = {
    displayName: 'Melee Bless',
    broadContexts: {
        'attack-status-mod': o => hasAllTags(o.tags, ['melee']) ? leaf('Melee Bless', 2) : undefined,
    },
}

describe('attack-status-mod (native)', () => {
    const o = createDefaultOwner({ ss: { meleeBless } })
    mutateOwnerTags(o)

    test('an applying status becomes a summed child leaf', () => {
        const node = attackStatusMod(o)
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Melee Bless 2'])
    })

    test('tag filtering: a ranged-only status is skipped against the melee shortsword', () => {
        const rangedOnly: ObjectWithBroadContexts = {
            displayName: 'Ranged Only',
            broadContexts: {
                'attack-status-mod': o => passesTags(weaponTags(o), ['ranged'], []) ? leaf('Ranged Only', 2) : undefined,
            },
        }
        const o = createDefaultOwner({ ss: { rangedOnly } })
        mutateOwnerTags(o)
        const node = attackStatusMod(o)
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
