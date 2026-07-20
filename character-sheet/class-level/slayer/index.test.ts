import { describe, test, assert, expect } from 'vitest'
import { ClassLevelMember, ClassLevelSheet, ClassLevels } from '../type'
import { slayerClassLevels } from '.'
import {
    newClassLevelSheet,
    sumAttackBonusFromClassLevels,
    sumFeatsFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumLevelsFromClassLevels,
    sumReflexSaveFromClassLevels,
} from '../index'
import { createDefaultOwner, defaultCharacterSheet } from '../../../defaults'
import { bandedMail, longSword } from '../../../defaults/equipment'
import { commitLevelUp } from '../../../character/level-up'
import studyTarget from '../../../ability-sheet/abilities/study-target'
import { act } from '../../../character/act'
import instantiateActor from '../../../character/actor'
import calculateAc from '../../../stat-modifier/ac'
import useAbility from '../../../character/act/ability'
import { resolveAbility } from '../../../simulate'
import { util_findModLogGroupItem } from '../../../stat-modifier/log'

// +1 attack each and the feats Alert, Con Saves, Power Attack + Armor Training, Measured Strike.
const slayerTemplate: ClassLevelMember[] = slayerClassLevels

// a second class to exercise multiclass summing
const rogueTemplate: ClassLevelMember[] = [
    { attackBonus: 0, fortitudeSave: 0, reflexSave: 1, feats: {} },
    { attackBonus: 1, fortitudeSave: 0, reflexSave: 1, feats: {} },
]

const buildLevel1Slayer = () => {
    const slayer = createDefaultOwner({
        cs: { str: 16, dex: 14, levels: {} },
        es: { mainhand: longSword, armor: bandedMail },
    })
    commitLevelUp(slayer, { className: 'slayer', bonusFeat: 'featDodgy' })
    return slayer
}

describe('Slayer: Studied Target Feature', () => {
    test('Slayer 1 grants this. Priority is correct', () => {
        const slayer = buildLevel1Slayer()

        expect(slayer.as.swift.items).toHaveProperty('Study Target')
        expect(slayer.as.swift.priority.filter(k => k === 'Study Target')).toHaveLength(1)
    })
    test.skip('Does not regrant', () => {

    })
    test('Operates as a swift action. Standard attack works.', () => {
        const slayer = buildLevel1Slayer()

        expect(studyTarget.castType).toEqual('swift')

        const results = act(slayer)
        const abilities = results.filter(r => 'ability' in r)
        const attacks = results.filter(r => !('ability' in r))

        expect(abilities).toHaveLength(1)
        expect(abilities[0].ability.displayName).toEqual('Study Target')
        expect(attacks.length).toBeGreaterThan(0)
    })

    test('does not stack when applied again', () => {
        const slayer = instantiateActor(buildLevel1Slayer())
        const target = instantiateActor(createDefaultOwner({}))

        const before = calculateAc(target.owner).total
        const aar = useAbility({ ...slayer.owner, ability: studyTarget })
        resolveAbility(slayer, target, aar)
        resolveAbility(slayer, target, aar)

        expect(calculateAc(target.owner).total).toEqual(before - 1)
        expect(util_findModLogGroupItem(calculateAc(target.owner).log, {
            groupName: 'statuses',
            modDisplayName: 'Studied Target',
        })).toEqual({ displayName: 'Studied Target', amount: -1 })
    })
})

/* describe('class level summing', () => {
    
})

describe('Supports feats from class levels', () => {

}) */
