import { describe, test, expect } from 'vitest'
import acStatusMod from './ac-status-mod'
import { createDefaultOwner } from '../../defaults'
import studiedTarget from '../bases/status/studied-target'
import divineProtection from '../bases/status/divine-protection'
import bless from '../bases/status/bless'

// LAYER: ac-status-mod is native, the mirror of ac-feat-mod - it sums every status on owner.ss that
// declares an 'ac-status-mod' contribution. Divine Protection (+N) and Studied Target (-1) are both
// unconditional; a status that boosts something else (bless -> attack) does not leak in here.

describe('ac-status-mod (native)', () => {
    test('divine protection contributes +acBonus', () => {
        const node = acStatusMod(createDefaultOwner({ ss: { divineProtection: divineProtection(2) } }))
        expect(node.total()).toBe(2)
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['Divine Protection 2'])
    })

    test('studied target contributes -1 (the studied creature is easier to hit)', () => {
        const node = acStatusMod(createDefaultOwner({ ss: { studiedTarget } }))
        expect(node.total()).toBe(-1)
    })

    test('statuses stack', () => {
        const node = acStatusMod(createDefaultOwner({
            ss: { divineProtection: divineProtection(3), studiedTarget },
        }))
        expect(node.total()).toBe(2) // +3 - 1
    })

    test('no statuses -> 0, no children', () => {
        const node = acStatusMod(createDefaultOwner({}))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })

    test('an attack-only status does not leak into the ac status mod', () => {
        // bless declares only 'attack-status-mod', so it is filtered out here entirely
        const node = acStatusMod(createDefaultOwner({ ss: { bless } }))
        expect(node.total()).toBe(0)
        expect(node.children).toEqual([])
    })
})
