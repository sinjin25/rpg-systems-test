import { Attack, AttackModifierFunc, AttackModifierFuncFactory, AttackModifierRequiredData } from './index'
import calculateBaseMod from './base-mod'

const finesseAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData
) => {
    return () => {
        return calculateBaseMod(data.characterSheet.dex)
    }
}

export default finesseAttackModifierFactory