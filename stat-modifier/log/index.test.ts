import { defaultCharacterSheet } from '../../character-sheet/index.ts'
import { defaultEquipmentSheet } from '../../equipment-sheet/index.ts'
import { defaultFeatSheet } from '../../feat/index.ts'
import { calculateBaseMod } from '../index.ts'
import { FinalModLogResult, default as ModifierLog } from './index.ts'
import { describe, test, assert, expect } from 'vitest'

describe('ModifierLog', () => {
    test('Works', () => {
        const modLog = ModifierLog('attack')
        modLog.addMod({
            amount: 1,
            displayName: 'feat'
        })
        modLog.addMod({
            amount: calculateBaseMod(16),
            displayName: 'strength'
        })
        modLog.addMod({
            amount: 1,
            displayName: 'Dagger +1'
        })
        modLog.addRoll({
            amount: 5,
            displayName: 'd6'
        })
        modLog.addRoll({
            amount: 3,
            displayName: 'd4'
        })

        const result = modLog.finalResult()
        expect(result).toMatchObject({
            modifier: 3 + 1 + 1,
            roll: 5 + 3,
            total: 3 + 1 + 1 + 5 + 3
        } as FinalModLogResult)
    })
    test('Works without modifiers', () => {
        const modLog = ModifierLog('attack')
        const result = modLog.finalResult()

        expect(result).toMatchObject({
            modifier: 0,
            roll: 0,
            total: 0,
        } as FinalModLogResult)
    })
})