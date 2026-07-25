import { describe, test, expect } from 'vitest'
import bless from './bless'
import attackStatusMod from '../../composition/attack-status-mod'
import { createDefaultOwner } from '../../../defaults'

// LAYER: bless (a status definition). It registers a +2 contribution under the 'attack-status-mod'
// broad context, unconditionally. Whether the owner actually HAS it is attack-status-mod's job
// (it reads owner.ss); the first test proves the registered contribution is +2, the second proves it
// folds into attack-status-mod when placed on the sheet.

describe('bless', () => {
    test('registers a +2 attack-status-mod contribution', () => {
        const contribution = bless.broadContexts['attack-status-mod']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(2)
    })

    test('folds into attack-status-mod when on the sheet', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { bless } }))
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Bless 2'])
    })
})
