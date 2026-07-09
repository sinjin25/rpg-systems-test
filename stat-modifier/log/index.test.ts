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

        /* console.log('addMogGroup test', modLog) */
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
    test('addModGroup records the group and counts its entries once', () => {
        const modLog = ModifierLog('damage')
        modLog.addModGroup('feat mod', {
            total: 3,
            entries: [
                { displayName: 'feat a', amount: 1 },
                { displayName: 'feat b', amount: 2 },
            ],
        })
        modLog.addModGroup('equipment mod', {
            total: 1,
            entries: [{ displayName: 'enhancement +1', amount: 1 }],
        })

        assert.equal(modLog.groups.length, 2)
        assert.deepEqual(modLog.groups.map(g => g.displayName), ['feat mod', 'equipment mod'])
        // entries flatten into mods so finalResult stays consistent
        assert.equal(modLog.mods.length, 3)
        assert.equal(modLog.finalResult().modifier, 4)

        /* console.log('addMogGroup test', modLog) */
    })
    test('detail on a member is informational and never summed', () => {
        const modLog = ModifierLog('initiative')
        modLog.addMod({
            amount: 1,
            displayName: 'dex modifier',
            detail: [{ displayName: 'ring plus two dex', amount: 2 }],
        })

        assert.equal(modLog.finalResult().modifier, 1)
    })
})