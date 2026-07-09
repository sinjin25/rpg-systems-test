import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"
import { calculateBaseMod } from "../../stat-modifier"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { ContextNames } from "../../contexts"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"
import { calculateStatusMod } from "../../status-sheet/status-mod"

export const finesseDamageModifierFactory: RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => {
    return () => {
        const {
            cs,
            es,
            fs,
            ss,
            weapon,
        } = data

        const BASE_CONTEXT = ['finesse', 'melee'] as ContextNames[]
        const EQUIPMENT_CONTEXT = [...weapon.contexts] as ContextNames[]

        const bm = namedMod('dex', calculateBaseMod(cs.dex))
        const fm = calculateFeatMod({
            cs,
            es,
            fs,
        }, [
            ...[...BASE_CONTEXT, ...EQUIPMENT_CONTEXT],
        ], 'damage')
        const em = calculateWeaponEquipmentMod(data, BASE_CONTEXT, 'damage')
        const sm = calculateStatusMod({ cs, ss }, [
            ...BASE_CONTEXT,
            ...EQUIPMENT_CONTEXT,
        ], 'damage')

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

export default finesseDamageModifierFactory
