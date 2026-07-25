import { describe, test, expect } from 'vitest'
import fatiguingBlows from './fatiguing-blows'
import attackStatusMod from '../../composition/attack-status-mod'
import { createDefaultOwner } from '../../../defaults'

// LAYER: fatiguing-blows (a status definition). It registers a -1 contribution under the
// 'attack-status-mod' broad context, unconditionally. Whether the owner HAS it is attack-status-mod's
// job (it reads owner.ss); the first test proves the registered contribution is -1, the second proves
// it folds into attack-status-mod when placed on the sheet.

describe('fatiguing-blows', () => {
    test('registers a -1 attack-status-mod contribution', () => {
        const contribution = fatiguingBlows.broadContexts['attack-status-mod']!
        expect(contribution(createDefaultOwner({}))!.total()).toBe(-1)
    })

    test('folds into attack-status-mod when on the sheet', () => {
        const node = attackStatusMod(createDefaultOwner({ ss: { fatiguingBlows } }))
        expect(node.total()).toBe(-1)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Fatiguing Blows -1'])
    })
})
