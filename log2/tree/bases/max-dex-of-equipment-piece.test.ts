import { describe, test, expect } from 'vitest'
import maxDexOfEquipmentPiece from './max-dex-of-equipment-piece'
import { Armor } from '../../../../equipment-sheet'

// LAYER: max-dex-of-equipment-piece (a leaf). One armor piece's dex cap.
// The load-bearing distinction lives here: a cap of 0 is the MOST restrictive
// real cap, while an absent cap means "unlimited" and must sort out of a min.

const armor = (maxDexBonus?: number): Armor =>
    ({ displayName: 'test', contexts: [], ac: 5, maxDexBonus } as Armor)

describe('max-dex-of-equipment-piece', () => {
    test('reports the piece\'s cap', () => {
        expect(maxDexOfEquipmentPiece(armor(1)).total()).toBe(1)
    })

    test('a cap of 0 stays 0 - it is a real, most-restrictive cap', () => {
        expect(maxDexOfEquipmentPiece(armor(0)).total()).toBe(0)
    })

    test('an absent cap is unlimited -> Infinity, so a min never picks it', () => {
        expect(maxDexOfEquipmentPiece(armor(undefined)).total()).toBe(Infinity)
    })
})
