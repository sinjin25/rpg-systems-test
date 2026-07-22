import { describe, test, expect } from 'vitest'
import catsGrace from './cats-grace'
import { createDefaultOwner } from '../../../defaults'

// LAYER: cats-grace (a status definition). It registers a +4 contribution under the
// 'dex-from-status' broad context. Whether the owner actually HAS it is dex-from-status's job
// (it reads owner.ss); here we just prove the registered contribution is +4.

describe("cats-grace", () => {
    test('registers a +4 dex-from-status contribution', () => {
        const contribution = catsGrace.broadContexts['dex-from-status']!
        expect(contribution(createDefaultOwner({})).total()).toBe(4)
    })
})
