import { describe, test, expect } from 'vitest'
import bullsStrength from './bulls-strength'
import { createDefaultOwner } from '../../../defaults'

// LAYER: bulls-strength (a status definition). It registers a +4 contribution under the
// 'str-from-status' broad context. Whether the owner actually HAS it is str-from-status's job
// (it reads owner.ss); here we just prove the registered contribution is +4.

describe("bulls-strength", () => {
    test('registers a +4 str-from-status contribution', () => {
        const contribution = bullsStrength.broadContexts['str-from-status']!
        expect(contribution(createDefaultOwner({})).total()).toBe(4)
    })
})
