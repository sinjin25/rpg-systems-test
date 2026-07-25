import { describe, test, expect } from 'vitest'
import strFromStatus from './status/str-from-status'
import bullsStrength from '../bases/status/bulls-strength'
import { createDefaultOwner } from '../../defaults'

describe('str-from-status', () => {
    test('sums the str statuses present on the sheet (Bull\'s Strength +4)', () => {
        const owner = createDefaultOwner({ ss: { bullsStrength } })
        expect(strFromStatus(owner).total()).toBe(4)
    })

    test('an empty status sheet contributes 0', () => {
        expect(strFromStatus(createDefaultOwner({})).total()).toBe(0)
    })
})
