import { describe, test, assert, expect } from 'vitest'
import { ClassLevelMember, ClassLevelSheet, ClassLevels } from '../type'
import { fighterClassLevels } from '.'
import {
    getCharacterLevel,
    newClassLevelSheet,
    sumAttackBonusFromClassLevels,
    sumFeatsFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumLevelsFromClassLevels,
    sumReflexSaveFromClassLevels,
} from '../index'
import { commitLevelUp } from '../../../character/level-up'
import { createDefaultOwner, defaultCharacterSheet } from '../../../defaults'
import { bandedMail, heavyShield, longSword } from '../../../defaults/equipment'
import { standardAttackModifierFactory } from '../../../attack'
import { standardDamageModifierFactory } from '../../../damage'
import calculateAc from '../../../stat-modifier/ac'
import calculateHp from '../../../stat-modifier/hp'

const classLevels = (displayName: string, data: ClassLevelMember[], level: number): ClassLevels => ({
    displayName,
    data,
    level,
})

describe('class level summing', () => {
    test('Benchmark level 1-4', () => {
        const fighter = createDefaultOwner({
            cs: { ...defaultCharacterSheet, str: 16, dex: 14, levels: {} },
            es: {
                mainhand: longSword,
                offhand: heavyShield,
                armor: bandedMail,
            }
        })
        commitLevelUp(fighter, {
            className: 'fighter',
            bonusFeat: 'featDodgy'
        })
        commitLevelUp(fighter, {
            className: 'fighter',
        })
        commitLevelUp(fighter, {
            className: 'fighter',
            bonusFeat: 'featRage'
        })
        commitLevelUp(fighter, {
            className: 'fighter',
        })

        expect(getCharacterLevel(fighter.cs)).toEqual(4)

        // --- attack roll modifier (the flat part; the d20 is added at roll time) ---
        // the modifier factory is stat/feat driven and does NOT fold in the class
        // level attack bonus, so the benchmark adds them together by hand.
        // featRage is a fight-start status feat (no attack context), so it does not apply here.
        const attackMod = standardAttackModifierFactory({ ...fighter, weapon: longSword })().total
        const classAttackBonus = sumAttackBonusFromClassLevels(fighter.cs.levels)
        expect(attackMod).toEqual(3)            // str 16 -> +3 (no melee/finesse attack feats granted)
        expect(classAttackBonus).toEqual(4)     // +1 per fighter level x4
        expect(attackMod + classAttackBonus).toEqual(7) // total bonus before the d20

        // --- ac ---
        // 10 base + 2 dex (dex 14) + 7 banded mail + 4 Dodgy feat.
        // NOTE: the heavy shield's +2 is NOT counted - only es.armor feeds AC today,
        // an offhand shield's `ac` never reaches calculateAc.
        expect(calculateAc(fighter).total).toEqual(23)

        // --- damage (the flat modifier; the longsword adds 1d8 on top) ---
        // str 16 -> +3, plus Power Attack +4 (granted at fighter 3, melee).
        const damageMod = standardDamageModifierFactory({ ...fighter, weapon: longSword })().total
        expect(damageMod).toEqual(7)

        // --- health ---
        // (10 per level + con mod 2) x 4 levels.
        expect(calculateHp(fighter).total).toEqual(48)

        // --- saves (reference; same split as attack - factory + class-level bonus) ---
        expect(sumFortitudeSaveFromClassLevels(fighter.cs.levels)).toEqual(2) // 1+0+1+0
        expect(sumReflexSaveFromClassLevels(fighter.cs.levels)).toEqual(0)
    })
})
