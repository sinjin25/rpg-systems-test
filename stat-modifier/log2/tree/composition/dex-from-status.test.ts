import { describe, test, expect } from 'vitest'
import dexFromStatus from './status/dex-from-status'
import catsGrace from '../bases/status/cats-grace'
import { asStatus } from './status/collect-status-contributions'
import { createDefaultOwner } from '../../../../defaults'

// LAYER: dex-from-status. Reads the runtime status sheet (owner.ss) and sums every dex-affecting
// status found there. Trusts each status leaf; this proves both that a present status is summed and
// that an absent one contributes nothing.

describe('dex-from-status', () => {
    test('sums the dex statuses present on the sheet (Cat\'s Grace +4)', () => {
        const owner = createDefaultOwner({ ss: { catsGrace: asStatus(catsGrace) } })
        expect(dexFromStatus(owner).total()).toBe(4)
    })

    test('an empty status sheet contributes 0', () => {
        expect(dexFromStatus(createDefaultOwner({})).total()).toBe(0)
    })
})
