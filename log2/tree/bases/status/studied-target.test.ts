import { describe, test, expect } from 'vitest'
import studiedTarget from './studied-target'
import acStatusMod from '../../composition/status/ac-status-mod'
import damageTakenStatusMod from '../../composition/status/damage-taken-status-mod'
import { createDefaultOwner } from '../../../defaults'

// LAYER: studied-target (a status definition). It registers two unconditional contributions: -1 under
// 'ac-status-mod' ("easier to hit") and +2 under 'damage-taken-status-mod' ("takes more damage"). Whether
// the owner HAS it is each aggregator's job (they read owner.ss); these tests prove the registered amounts
// and that they fold in when the status is on the sheet.

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

    test('registers a +2 damage-taken-status-mod contribution', () => {
        const contribution = studiedTarget.broadContexts['damage-taken-status-mod']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(2)
    })

    test('folds into damage-taken-status-mod when on the sheet', () => {
        const node = damageTakenStatusMod(createDefaultOwner({ ss: { studiedTarget } }))
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Studied Target 2'])
    })
})
