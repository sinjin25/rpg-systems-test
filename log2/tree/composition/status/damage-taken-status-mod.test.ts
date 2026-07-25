import { describe, test, expect } from 'vitest'
import damageTakenStatusMod from './damage-taken-status-mod'
import { createDefaultOwner } from '../../../defaults'
import { StatusEffectMaximal } from '../../types'
import { leaf, findNodeMatching } from '../../..'

// LAYER: damage-taken-status-mod (aggregator). Sums every status on owner.ss that declares a
// 'damage-taken-status-mod' contribution. Empty sheet -> no children -> 0. Mirrors ac-status-mod.

const dtStatus = (amount: number): StatusEffectMaximal => ({
    displayName: 'Test DT',
    broadContexts: { 'damage-taken-status-mod': () => leaf('Test DT', amount) },
})

describe('damage-taken-status-mod', () => {
    test('is 0 with no contributing statuses', () => {
        expect(damageTakenStatusMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing status and surfaces its leaf', () => {
        const node = damageTakenStatusMod(createDefaultOwner({ ss: { a: dtStatus(3) } }))
        expect(node.total()).toBe(3)
        expect(findNodeMatching(node, /Test DT/i)).toBeTruthy()
    })

    test('a reduction is just a negative contribution', () => {
        const node = damageTakenStatusMod(createDefaultOwner({ ss: { a: dtStatus(2), b: dtStatus(-5) } }))
        expect(node.total()).toBe(-3)
    })
})
