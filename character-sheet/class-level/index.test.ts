import { attackBonusForClass, cloneClassLevelSheet, fortitudeSaveForClass, getCharacterLevel, newClassLevelSheet, reflexSaveForClass, sumAbilitiesFromClassLevels, sumAttackBonusFromClassLevels, sumFeatsFromClassLevels, sumFortitudeSaveFromClassLevels, sumLevelsFromClassLevels, sumReflexSaveFromClassLevels } from './derive/index'
import { classRegistry } from './registry'
import { describe, test, assert, expect } from 'vitest'



describe('Basic utilities', () => {
    test('basic assumptions', () => {
        //access
        const fighterLevels = classRegistry['fighter']!.data
        assert.equal(fighterLevels.length, 4)
    })
    test('clampedLevel', () => {
        const fighterLevels = classRegistry['fighter']!.data

    })
})