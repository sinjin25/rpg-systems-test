import { ContextNames } from "../../contexts"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { calculateBaseMod } from "../../stat-modifier"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"

export const standardDamageModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const { characterSheet, equipmentSheet, featSheet, weapon } = data

        const BASE_CONTEXT = [] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)

        const bm = calculateBaseMod(characterSheet.str)
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'damage')

        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'damage')

        return bm + fm + em
    }
}

export default standardDamageModifierFactory
