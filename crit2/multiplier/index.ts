import { ContextNames } from "../../contexts"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import { calculateStatusMod } from "../../status-sheet/status-mod"
import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"

const DEFAULT_MULTIPLIER = 1.5

export const critMultiplierModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const { cs, es, fs, ss, weapon } = data

        const BASE_CONTEXT = [] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)

        const bm = namedMod('weapon base', weapon.critMultiplier ?? DEFAULT_MULTIPLIER)
        const fm = calculateFeatMod({
            cs,
            es,
            fs,
        }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'critMultiplier')

        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'critMultiplier')
        const sm = calculateStatusMod({ cs, ss }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'critMultiplier')

        return {
            total: bm.total + fm.total + em.total + sm.total,
            groups: [
                { displayName: 'base mod', ...bm },
                { displayName: 'feat mod', ...fm },
                { displayName: 'equipment mod', ...em },
                { displayName: 'status mod', ...sm },
            ],
        }
    }
}

export default critMultiplierModifierFactory
