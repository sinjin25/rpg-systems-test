import { describe, test, expect } from 'vitest'
import damageTakenStatusMod from './damage-taken-status-mod'
import { createDefaultOwner } from '../../../actor2'
import { leaf, findNodeMatching } from '../..'
import { makeWrapper } from '../../../status-sheet2'
import { inst } from '../../../status-sheet2/testing'

const dtStatus = (amount: number) => makeWrapper({
    displayName: 'Test DT',
    broadContexts: { 'damage-taken-status-mod': () => leaf('Test DT', amount) },
})

describe('damage-taken-status-mod', () => {
    test('is 0 with no contributing statuses', () => {
        expect(damageTakenStatusMod(createDefaultOwner({})).total()).toBe(0)
    })

    test('sums a contributing status and surfaces its leaf', () => {
        const node = damageTakenStatusMod(createDefaultOwner({ ss: { a: [inst(dtStatus(3))] } }))
        expect(node.total()).toBe(3)
        expect(findNodeMatching(node, /Test DT/i)).toBeTruthy()
    })

    test('a reduction is just a negative contribution', () => {
        const node = damageTakenStatusMod(createDefaultOwner({ ss: { a: [inst(dtStatus(2))], b: [inst(dtStatus(-5))] } }))
        expect(node.total()).toBe(-3)
    })
})
