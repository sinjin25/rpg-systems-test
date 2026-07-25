import { describe, test, expect } from 'vitest'
import acOfEquipmentPiece from './ac-of-equipment-piece'
import { Armor } from '../../equipment-sheet'
const armor = (ac?: number): Armor => ({ displayName: 'test', contexts: [], ac } as Armor)

describe('ac-of-equipment-piece', () => {
    test('reports the piece\'s ac', () => {
        expect(acOfEquipmentPiece(armor(7)).total()).toBe(7)
    })

    test('a piece with no ac contributes 0', () => {
        expect(acOfEquipmentPiece(armor(undefined)).total()).toBe(0)
    })
})
