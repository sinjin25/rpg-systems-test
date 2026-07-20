import { describe, test, assert } from 'vitest'
import { ClassLevelMember, ClassLevelSheet, ClassLevels } from '../type'
import { fighterClassLevels } from '.'
import {
    newClassLevelSheet,
    sumAttackBonusFromClassLevels,
    sumFeatsFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumLevelsFromClassLevels,
    sumReflexSaveFromClassLevels,
} from '../index'

// +1 attack each and the feats Alert, Con Saves, Power Attack + Armor Training, Measured Strike.
const fighterTemplate: ClassLevelMember[] = fighterClassLevels

// a second class to exercise multiclass summing
const rogueTemplate: ClassLevelMember[] = [
    { attackBonus: 0, fortitudeSave: 0, reflexSave: 1, feats: {} },
    { attackBonus: 1, fortitudeSave: 0, reflexSave: 1, feats: {} },
]

const classLevels = (displayName: string, data: ClassLevelMember[], level: number): ClassLevels => ({
    displayName,
    data,
    level,
})

describe('class level summing', () => {
    test('Sums only up until level, not full table', () => {
        // fighter 2 => first two indexes
        const sheet: ClassLevelSheet = { fighter: classLevels('Fighter', fighterTemplate, 2) }

        assert.equal(sumAttackBonusFromClassLevels(sheet), 2) // 1 + 1
        assert.equal(sumFortitudeSaveFromClassLevels(sheet), 1) // 1 + 0
        assert.equal(sumReflexSaveFromClassLevels(sheet), 0) // 0 + 0
        assert.equal(sumLevelsFromClassLevels(sheet), 2)
    })

    test('Boundary: max class level (fragile)', () => {
        const sheet: ClassLevelSheet = { fighter: classLevels('Fighter', fighterTemplate, fighterTemplate.length) }

        assert.equal(sumAttackBonusFromClassLevels(sheet), 4)
        assert.equal(sumFortitudeSaveFromClassLevels(sheet), 2) // 1+0+1+0
        assert.equal(sumReflexSaveFromClassLevels(sheet), 0) // 0+0+0+0
        assert.equal(sumLevelsFromClassLevels(sheet), 4)
    })

    test('boundary: a level higher than the table length clamps to the table', () => {
        // sheets should match
        const sheet: ClassLevelSheet = { fighter: classLevels('Fighter', fighterTemplate, 99) }
        const full: ClassLevelSheet = { fighter: classLevels('Fighter', fighterTemplate, fighterTemplate.length) }

        assert.equal(sumAttackBonusFromClassLevels(sheet), sumAttackBonusFromClassLevels(full))
        assert.equal(sumFortitudeSaveFromClassLevels(sheet), sumFortitudeSaveFromClassLevels(full))
        assert.equal(sumReflexSaveFromClassLevels(sheet), sumReflexSaveFromClassLevels(full))
        assert.equal(sumLevelsFromClassLevels(sheet), fighterTemplate.length)
        assert.deepEqual(sumFeatsFromClassLevels(sheet), sumFeatsFromClassLevels(full))
    })

    test('Supports class dips', () => {
        const sheet: ClassLevelSheet = {
            fighter: classLevels('Fighter', fighterTemplate, 2), // atk 2, fort 1, ref 0
            rogue: classLevels('Rogue', rogueTemplate, 2), // atk 1, fort 0, ref 2
        }

        assert.equal(sumAttackBonusFromClassLevels(sheet), 3)
        assert.equal(sumFortitudeSaveFromClassLevels(sheet), 1)
        assert.equal(sumReflexSaveFromClassLevels(sheet), 2)
        assert.equal(sumLevelsFromClassLevels(sheet), 4)
    })

    test('an empty sheet sums to zero', () => {
        const sheet = newClassLevelSheet()

        assert.deepEqual(sheet, {})
        assert.equal(sumAttackBonusFromClassLevels(sheet), 0)
        assert.equal(sumFortitudeSaveFromClassLevels(sheet), 0)
        assert.equal(sumReflexSaveFromClassLevels(sheet), 0)
        assert.equal(sumLevelsFromClassLevels(sheet), 0)
    })
})

describe('Supports feats from class levels', () => {
    test('merges the free feats from acquired levels only', () => {
        const sheet: ClassLevelSheet = { fighter: classLevels('Fighter', fighterTemplate, 2) }

        const feats = sumFeatsFromClassLevels(sheet)

        // first two fighter levels grant Alert and Con Saves...
        assert.exists(feats.featAlert)
        assert.exists(feats.featConSaves)
        // but not later level feats
        assert.notExists(feats.featPowerAttack)
        assert.notExists(feats.featArmorTraining) // granted at level 3
        assert.notExists(feats.featMeasuredStrike)
    })

    test('merges feats across classes and full progression', () => {
        const sheet: ClassLevelSheet = {
            fighter: classLevels('Fighter', fighterTemplate, 4),
            rogue: classLevels('Rogue', rogueTemplate, 2),
        }

        const feats = sumFeatsFromClassLevels(sheet)

        assert.exists(feats.featAlert)
        assert.exists(feats.featConSaves)
        assert.exists(feats.featPowerAttack)
        assert.exists(feats.featArmorTraining)
        assert.exists(feats.featMeasuredStrike)
    })

    test('an empty sheet grants no feats', () => {
        assert.deepEqual(sumFeatsFromClassLevels(newClassLevelSheet()), {})
    })
})
