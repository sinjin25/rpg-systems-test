import { ContextNames } from "../../contexts"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { calculateBaseMod } from "../../stat-modifier"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"

export const standardDamageModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const { cs, es, fs, weapon } = data

        const BASE_CONTEXT = [] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)

        const bm = namedMod('str', calculateBaseMod(cs.str))
        const fm = calculateFeatMod({
            cs,
            es,
            fs,
        }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'damage')

        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'damage')

        return {
            total: bm.total + fm.total + em.total,
            groups: [
                { displayName: 'base mod', ...bm },
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
            ],
        }
    }
}

export default standardDamageModifierFactory
