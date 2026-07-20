import { describe, test, expect } from 'vitest'
import {
    getCharacterLevel,
    sumAttackBonusFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumReflexSaveFromClassLevels,
} from '../index'
import { commitLevelUp } from '../../../character/level-up'
import { createDefaultOwner, defaultCharacterSheet } from '../../../defaults'
import { bandedMail, heavyShield, longSword } from '../../../defaults/equipment'
import { standardAttackModifierFactory } from '../../../attack'
import { standardDamageModifierFactory } from '../../../damage'
import { fortitudeSaveModifierFactory, reflexSaveModifierFactory } from '../../../save'
import { ModGroup } from '../../../stat-modifier/log'
import calculateAc from '../../../stat-modifier/ac'
import calculateHp from '../../../stat-modifier/hp'
import { Weapon } from '../../../equipment-sheet'

// pull a single named modifier group's total out of a log/factory result, so each
// test can assert where its bonuses come from one source at a time.
const groupTotal = (groups: ModGroup[], displayName: string): number => {
    const group = groups.find(g => g.displayName === displayName)
    if (!group) throw new Error(`benchmark: no "${displayName}" modifier group found`)
    return group.total
}

// a common level-4 fighter: str 16 / dex 14 / con 15, longsword + heavy shield + banded mail.
// four fighter levels grant Alert, Con Saves, Power Attack + Armor Training (L3),
// Measured Strike plus the selected bonus feats Dodgy (L1) and Rage (L3).
const buildLevel4Fighter = () => {
    const fighter = createDefaultOwner({
        cs: { ...defaultCharacterSheet, str: 16, dex: 14, levels: {} },
        es: {
            mainhand: longSword,
            offhand: heavyShield,
            armor: bandedMail,
        },
    })
    commitLevelUp(fighter, { className: 'fighter', bonusFeat: 'featDodgy' }) // L1
    commitLevelUp(fighter, { className: 'fighter' })                         // L2
    commitLevelUp(fighter, { className: 'fighter', bonusFeat: 'featRage' })  // L3
    commitLevelUp(fighter, { className: 'fighter' })                         // L4
    return fighter
}

// the tests below only read the fighter, so one shared instance is fine
const fighter = buildLevel4Fighter()

describe('Level 4 fighter benchmark', () => {
    test('is character level 4', () => {
        expect(getCharacterLevel(fighter.cs)).toEqual(4)
    })

    test('attack modifier: str +3 and BAB +4', () => {
        // the d20 is added at roll time; this is just the flat part.
        // featRage is a fight-start status feat (no attack context) so it never applies here.
        const attack = standardAttackModifierFactory({ ...fighter, weapon: longSword as Weapon })()

        expect(groupTotal(attack.groups, 'base mod')).toEqual(3)      // str 16 -> +3
        expect(groupTotal(attack.groups, 'base attack bonus')).toEqual(4)   // BAB: +1 per fighter level x4
        expect(groupTotal(attack.groups, 'feat mod')).toEqual(0)      // no melee/finesse attack feats granted
        expect(groupTotal(attack.groups, 'equipment mod')).toEqual(0) // plain longsword
        expect(groupTotal(attack.groups, 'status mod')).toEqual(0)

        // the 'class level' group is exactly the class-level attack bonus summer
        expect(sumAttackBonusFromClassLevels(fighter.cs.levels)).toEqual(4)

        expect(attack.total).toEqual(7) // 3 + 4
    })

    test('ac: 10 base + 2 dex + 9 armor + 4 Dodgy', () => {
        const ac = calculateAc(fighter)

        expect(groupTotal(ac.log.groups, 'base ac')).toEqual(10)
        // dex 14 -> +2. banded mail's base max dex is +1, but Armor Training (L3) raises
        // the allowance to +2 via the 'maxDex' broadcontext, so the full +2 applies.
        expect(groupTotal(ac.log.groups, 'dexterity')).toEqual(2)
        // banded mail (7) + heavy shield (2): both flat-ac pieces now count (issue #59)
        expect(groupTotal(ac.log.groups, 'armor')).toEqual(9)
        expect(groupTotal(ac.log.groups, 'feats')).toEqual(4)     // featDodgy
        // the shield's ac is a flat bonus (armor group), not a mods.ac effect
        expect(groupTotal(ac.log.groups, 'equipment')).toEqual(0)
        expect(groupTotal(ac.log.groups, 'statuses')).toEqual(0)

        expect(ac.total).toEqual(25)
    })

    test('damage modifier: str +3 and Power Attack +4 (plus 1d8 weapon)', () => {
        const damage = standardDamageModifierFactory({ ...fighter, weapon: longSword as Weapon })()

        expect(groupTotal(damage.groups, 'base mod')).toEqual(3)   // str 16 -> +3
        expect(groupTotal(damage.groups, 'feat mod')).toEqual(4)   // featPowerAttack (melee), granted at fighter 3
        expect(groupTotal(damage.groups, 'equipment mod')).toEqual(0)
        expect(groupTotal(damage.groups, 'status mod')).toEqual(0)

        expect(damage.total).toEqual(7) // flat bonus; the longsword rolls 1d8 on top
    })

    test('health: (10 + con 2) x 4 levels', () => {
        const hp = calculateHp(fighter)

        // base health folds the con mod (con 15 -> +2) and level in: (10 + 2) * 4
        expect(groupTotal(hp.log.groups, 'base health')).toEqual(48)
        expect(groupTotal(hp.log.groups, 'feats')).toEqual(0)
        expect(groupTotal(hp.log.groups, 'equipment')).toEqual(0)
        expect(groupTotal(hp.log.groups, 'statuses')).toEqual(0)

        expect(hp.total).toEqual(48)
    })

    test('saves: fortitude (con + Con Saves + class), reflex (dex)', () => {
        const fort = fortitudeSaveModifierFactory(fighter)()
        const reflex = reflexSaveModifierFactory(fighter)()

        // unlike attack, the class-level save bonus is NOT folded into the factory yet,
        // so the factory total is stat + feats only and the class portion is added by hand.
        expect(groupTotal(fort.groups, 'base mod')).toEqual(2) // con 15 -> +2
        expect(groupTotal(fort.groups, 'feat mod')).toEqual(1) // featConSaves
        expect(fort.total).toEqual(3)
        expect(sumFortitudeSaveFromClassLevels(fighter.cs.levels)).toEqual(2) // 1+0+1+0
        expect(fort.total + sumFortitudeSaveFromClassLevels(fighter.cs.levels)).toEqual(5) // effective fortitude

        expect(groupTotal(reflex.groups, 'base mod')).toEqual(2) // dex 14 -> +2
        expect(groupTotal(reflex.groups, 'feat mod')).toEqual(0)
        expect(reflex.total).toEqual(2)
        expect(sumReflexSaveFromClassLevels(fighter.cs.levels)).toEqual(0)
    })
})
