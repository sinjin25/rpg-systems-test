import { createDefaultOwner } from '../defaults'
import rawCsScore from './raw-cs-score.ts'
import { describe, test, assert, expect } from 'vitest'

describe('Can grab raw scores', () => {
    test('Str', () => {
        const owner = createDefaultOwner()
        const rawStr = rawCsScore('str')(owner)
    })
    test('Con', () => {
        const owner = createDefaultOwner({
            cs: {
                con: 13,
            }
        })
        const rawStr = rawCsScore('con')(owner)
    })
    test('Dex', () => {
        const owner = createDefaultOwner({
            cs: {
                dex: 14
            }
        })
        const rawStr = rawCsScore('dex')(owner)
    })
})