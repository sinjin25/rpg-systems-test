import { ContextNames } from "../../contexts"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import calculateEquipmentMod from "../../equipment-sheet/equipment-mod"
import { calculateStatusMod } from "../../status-sheet/status-mod"
import { HealModifierFuncFactory, HealModifierRequiredData } from "../types"

export const standardHealModifierFactory: HealModifierFuncFactory = (
    data: HealModifierRequiredData,
) => {
    return () => {
        const { cs, es, fs, ss, baseHeal } = data

        const BASE_CONTEXT = [] as ContextNames[]

        const bm = namedMod('base heal', baseHeal)
        const fm = calculateFeatMod({ cs, es, fs }, BASE_CONTEXT, 'heal')
        const em = calculateEquipmentMod(Object.values(es), { cs, es, fs, ss }, BASE_CONTEXT, 'heal')
        const sm = calculateStatusMod({ cs, ss }, BASE_CONTEXT, 'heal')

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

export default standardHealModifierFactory
