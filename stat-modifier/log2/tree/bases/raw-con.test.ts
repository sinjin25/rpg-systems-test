import { describe, test, expect } from 'vitest'
import newRawCon from './raw-con'
import { createDefaultOwner } from '../../defaults'

// LAYER: raw-con reports the con SCORE straight off the sheet (no modifier conversion - modded-con owns
// that). Mirrors raw-dex/raw-str.
describe('raw-con', () => {
    test('reports the con score verbatim', () => {
        expect(newRawCon(createDefaultOwner({ cs: { con: 14 } })).total()).toBe(14)
        expect(newRawCon(createDefaultOwner({ cs: { con: 7 } })).total()).toBe(7)
    })
})
