import { ContextNames } from "../../contexts"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { calculateBaseMod } from "../../stat-modifier"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { AttackModifierFuncFactory, AttackModifierRequiredData } from "../types"

export const standardAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData,
) => {
    return () => {
        const { characterSheet, equipmentSheet, featSheet, statusSheet, weapon } = data

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
        ], 'attack')

        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'attack')

        return bm + fm + em
    }
}

export default standardAttackModifierFactory