import { ContextNames } from "../../contexts"
import { extractContextsTags } from "../../equipment-sheet/extract"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import { calculateStatusMod } from "../../status-sheet/status-mod"
import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"

const DEFAULT_THREAT_RANGE = 20

// widening the threat range means shrinking this number (e.g. Improved Critical
// contributes -1, taking a 20 down to 19, so it threatens on a 19 or a 20)
export const critRangeModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const { cs, es, fs, ss, weapon } = data

        const BASE_CONTEXT = [] as ContextNames[]
        const EQUIPMENT_CONTEXT = extractContextsTags(weapon)

        const bm = namedMod('weapon base', weapon.critRange ?? DEFAULT_THREAT_RANGE)
        const fm = calculateFeatMod({
            cs,
            es,
            fs,
        }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'critRange')

        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'critRange')
        const sm = calculateStatusMod({ cs, ss }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'critRange')

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

export default critRangeModifierFactory
