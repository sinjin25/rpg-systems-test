import { RollModifierFuncFactory, RollModifierRequiredData } from "../../roll-modifier/types"
import { calculateBaseMod } from "../../stat-modifier"
import { namedMod } from "../../stat-modifier/log"
import calculateFeatMod from "../../roll-modifier/feat-mod"
import { ContextNames } from "../../contexts"
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod"

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

        const bm = namedMod('dex', calculateBaseMod(characterSheet.dex))
        const fm = calculateFeatMod({
            characterSheet,
            equipmentSheet,
            featSheet,
        }, [
            ...[...BASE_CONTEXT, ...EQUIPMENT_CONTEXT],
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

export default finesseDamageModifierFactory
