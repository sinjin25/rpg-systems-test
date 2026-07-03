import { Attack, AttackModifierFunc, AttackModifierFuncFactory, AttackModifierRequiredData } from '../types'
import calculateBaseMod from '../base-mod'
import calculateFeatMod from '../feat-mod'
import { ContextNames } from '../../contexts'
import { calculateAttackEquipmentMod } from '../equipment-mod'
import { extractContextsTags } from '../../equipment-sheet/extract'

export const finesseAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData
) => {
    return () => {
        const {
            characterSheet,
            equipmentSheet,
            featSheet,
            statusSheet,
            weapon,
        } = data

        const BASE_CONTEXT = ['finesse', 'melee'] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)
        /* console.log('EQUIPMENT_CONTEXT', weapon.contexts) */

        const bm = calculateBaseMod(characterSheet.dex)
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...[...BASE_CONTEXT, ...EQUIPMENT_CONTEXT],
        ], 'attack')
        const em = calculateAttackEquipmentMod(data, BASE_CONTEXT, 'attack')

        /* console.table({
            bm,
            fm,
            em,
        }) */

        return bm + fm + em
    }
}

export default finesseAttackModifierFactory