import { describe, test, expect } from 'vitest'
import attackStatusMod from './attack-status-mod'
import { createDefaultOwner } from '../../actor2'
import { leaf } from '..'
import bullsStrength from '../../status-sheet2/status/bulls-strength'
import { makeWrapper } from '../../status-sheet2'
import { inst } from '../../status-sheet2/testing'
import { OwnerLog2 } from '../types'
import { hasAllTags } from '../tags'

// +2 attack, but only on a melee weapon
const meleeBless = makeWrapper({
    displayName: 'Melee Bless',
    broadContexts: {
        'attack-status-mod': (o, opts) => hasAllTags(opts.tags ?? [], ['melee']) ? leaf('Melee Bless', 2) : undefined,
    },
})

const rangedOnly = makeWrapper({
    displayName: 'Ranged Only',
    broadContexts: {
        'attack-status-mod': (o: OwnerLog2, opts) => hasAllTags(opts.tags ?? [], ['ranged']) ? leaf('Ranged Only', 2) : undefined,
    },
})

describe('attack-status-mod (native)', () => {
    const o = createDefaultOwner({ ss: { meleeBless: [inst(meleeBless)] } })

    test('an applying status becomes a summed child leaf', () => {
        const node = attackStatusMod(o, { tags: ['melee'] })
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Melee Bless 2'])
    })

    test('tag filtering: a ranged-only status is skipped against the melee shortsword', () => {
        const o = createDefaultOwner({ ss: { rangedOnly: [inst(rangedOnly)] } })
        const node = attackStatusMod(o, { tags: ['melee'] })
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('no statuses -> 0, no children', () => {
        const node = attackStatusMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('a stat-boost status (no attack-status-mod contribution) contributes 0 here', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { bullsStrength: [inst(bullsStrength)] } }))
        expect(node.total()).toBe(0)
    })
})
