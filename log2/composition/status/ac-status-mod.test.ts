import { describe, test, expect } from 'vitest'
import acStatusMod from './ac-status-mod'
import { createDefaultOwner } from '../../defaults'
import studiedTarget from '../../../status-sheet2/status/studied-target'
import divineProtection from '../../../status-sheet2/status/divine-protection'
import bless from '../../../status-sheet2/status/bless'

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
