import { describe, test, expect } from 'vitest'
import newRawCon from './raw-con'
import { createDefaultOwner } from '../../defaults'

describe('raw-con', () => {
    test('reports the con score verbatim', () => {
        expect(newRawCon(createDefaultOwner({ cs: { con: 14 } })).total()).toBe(14)
        expect(newRawCon(createDefaultOwner({ cs: { con: 7 } })).total()).toBe(7)
    })
})
