import { ContextNames } from "../../contexts"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { calculateBaseMod } from "../../stat-modifier"
import { namedMod } from "../../stat-modifier/log"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { AttackModifierFuncFactory, AttackModifierRequiredData } from "../types"

export const standardAttackModifierFactory: AttackModifierFuncFactory = (
    data: AttackModifierRequiredData,
) => {
    return () => {
        const { cs, es, fs, ss, weapon } = data

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
        ], 'attack')

        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'attack')

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

export default standardAttackModifierFactory