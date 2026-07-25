import { describe, test, expect } from 'vitest'
import dexFromStatus from './status/dex-from-status'
import catsGrace from '../bases/status/cats-grace'
import { createDefaultOwner } from '../../defaults'

describe('dex-from-status', () => {
    test('sums the dex statuses present on the sheet (Cat\'s Grace +4)', () => {
        const owner = createDefaultOwner({ ss: { catsGrace } })
        expect(dexFromStatus(owner).total()).toBe(4)
    })

    test('an empty status sheet contributes 0', () => {
        expect(dexFromStatus(createDefaultOwner({})).total()).toBe(0)
    })
})
