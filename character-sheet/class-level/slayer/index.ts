import studyTarget from '../../../ability-sheet/abilities/study-target'
import { featAlert } from '../../../feat/feats'
import { ClassLevelMember } from '../type'

const ATTACK_BONUS_PER_LEVEL = 1

export const slayerClassLevels: Array<ClassLevelMember> = []

// 0
slayerClassLevels.push({
    attackBonus: ATTACK_BONUS_PER_LEVEL,
    feats: {
        featAlert,
    },
    abilities: [studyTarget],
    fortitudeSave: 1,
    reflexSave: 0,
    selectBonusFeat: true,
})
