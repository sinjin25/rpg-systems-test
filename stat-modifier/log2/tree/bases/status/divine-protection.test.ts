import { describe, test, expect } from 'vitest'
import divineProtection from './divine-protection'
import acStatusMod from '../../composition/ac-status-mod'
import { createDefaultOwner } from '../../../defaults'

// LAYER: divine-protection (a status definition, factory). It registers a +acBonus contribution under the
// 'ac-status-mod' broad context, unconditionally. Whether the owner HAS it is ac-status-mod's job (it reads
// owner.ss); the first test proves the registered contribution matches acBonus, the second proves it folds
// in when on the sheet.

describe('divine-protection', () => {
    test('registers a +acBonus ac-status-mod contribution', () => {
        const contribution = divineProtection(4).broadContexts['ac-status-mod']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(4)
    })

    test('folds into ac-status-mod when on the sheet', () => {
        const node = acStatusMod(createDefaultOwner({ ss: { divineProtection: divineProtection(2) } }))
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Divine Protection 2'])
    })
})
