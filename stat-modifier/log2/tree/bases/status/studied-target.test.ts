import { describe, test, expect } from 'vitest'
import studiedTarget from './studied-target'
import acStatusMod from '../../composition/ac-status-mod'
import { createDefaultOwner } from '../../../defaults'

// LAYER: studied-target (a status definition). It registers a -1 contribution under the 'ac-status-mod'
// broad context, unconditionally. Whether the owner HAS it is ac-status-mod's job (it reads owner.ss);
// the first test proves the registered contribution is -1, the second proves it folds in when on the sheet.

describe('studied-target', () => {
    test('registers a -1 ac-status-mod contribution', () => {
        const contribution = studiedTarget.broadContexts['ac-status-mod']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(-1)
    })

    test('folds into ac-status-mod when on the sheet', () => {
        const node = acStatusMod(createDefaultOwner({ ss: { studiedTarget } }))
        expect(node.total()).toBe(-1)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Studied Target -1'])
    })
})
