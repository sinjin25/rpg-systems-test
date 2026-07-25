import { describe, test, expect } from 'vitest'
import strFromStatus from './status/str-from-status'
import bullsStrength from '../bases/status/bulls-strength'
import { createDefaultOwner } from '../../defaults'

// LAYER: str-from-status. Reads the runtime status sheet (owner.ss) and sums every str-affecting
// status found there. Trusts each status leaf; this proves both that a present status is summed and
// that an absent one contributes nothing.

describe('str-from-status', () => {
    test('sums the str statuses present on the sheet (Bull\'s Strength +4)', () => {
        const owner = createDefaultOwner({ ss: { bullsStrength } })
        expect(strFromStatus(owner).total()).toBe(4)
    })

    test('an empty status sheet contributes 0', () => {
        expect(strFromStatus(createDefaultOwner({})).total()).toBe(0)
    })
})
