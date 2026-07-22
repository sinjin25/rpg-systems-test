import { describe, test, expect } from 'vitest'
import flatFooted from './flat-footed'
import { createDefaultOwner } from '../../../../../defaults'

describe("cats-grace", () => {
    test('registers a +4 dex-from-status contribution', () => {
        const contribution = flatFooted.broadContexts['max-dex-of-equipment']!

        expect(contribution(createDefaultOwner({})).total()).toBe(0)
    })
})
