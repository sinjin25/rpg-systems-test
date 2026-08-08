import { improvedInitiative, armorTraining, conSaves, powerAttack, deriveFeatName } from '../../../feat2/feats/index'
import { ClassLevelMember, ClassLevelSheet, ClassLevels } from '../type'

const ATTACK_BONUS_PER_LEVEL = 1

export const fighterClassLevels: Array<ClassLevelMember> = []

// 0
fighterClassLevels.push({
    attackBonus: ATTACK_BONUS_PER_LEVEL,
    feats: {
        [deriveFeatName(improvedInitiative)]: improvedInitiative,
    },
    fortitudeSave: 1,
    reflexSave: 0,
    selectBonusFeat: true,
})

fighterClassLevels.push({
    attackBonus: ATTACK_BONUS_PER_LEVEL,
    feats: {
        [deriveFeatName(conSaves)]: conSaves,
    },
    fortitudeSave: 0,
    reflexSave: 0,
})

// level 3: Power Attack plus Armor Training (raises worn armor's max dex bonus by +1)
fighterClassLevels.push({
    attackBonus: ATTACK_BONUS_PER_LEVEL,
    feats: {
        [deriveFeatName(powerAttack)]: powerAttack,
        [deriveFeatName(armorTraining)]: armorTraining,
    },
    fortitudeSave: 1,
    reflexSave: 0,
    selectBonusFeat: true,
})

fighterClassLevels.push({
    attackBonus: ATTACK_BONUS_PER_LEVEL,
    feats: {
        /* featMeasuredStrike */
    },
    fortitudeSave: 0,
    reflexSave: 0,
})

// 4