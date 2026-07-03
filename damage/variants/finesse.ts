import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"
import calculateBaseMod from "../../attack/base-mod"
import calculateFeatMod from "../../attack/feat-mod"
import { ContextNames } from "../../contexts"
import { calculateAttackEquipmentMod } from "../../attack/equipment-mod"

export const finesseDamageModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const {
            characterSheet,
            equipmentSheet,
            featSheet,
            weapon,
        } = data

        const BASE_CONTEXT = ['finesse', 'melee'] as ContextNames[]
        const EQUIPMENT_CONTEXT = [...weapon.contexts] as ContextNames[]

        const bm = calculateBaseMod(characterSheet.dex)
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...[...BASE_CONTEXT, ...EQUIPMENT_CONTEXT],
        ], 'damage')
        const em = calculateAttackEquipmentMod(data, BASE_CONTEXT, 'damage')

        return bm + fm + em
    }
}

export default finesseDamageModifierFactory
