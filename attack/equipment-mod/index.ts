import { BroadContexts, ContextNames } from "../../contexts";
import { FeatContext } from "../../feat/core-types";
import { FeatSheet } from "../../feat";
import { CharacterSheet } from "../../character-sheet";
import { BaseEquipment, equipmentIsBaseEquipment, equipmentIsWeapon, EquipmentSheet, Weapon } from "../../equipment-sheet";

export type CalculateEquipmentModRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: EquipmentSheet,
    // only the relevant weapon is counted
    weapon: Weapon,
}

export const calculateAttackEquipmentMod = (
    data: CalculateEquipmentModRequiredData,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    const mod = 0

    const notWeaponEquipment = Object.values(data.equipmentSheet)
        .filter(a => {
            return !(equipmentIsWeapon(a))
        })

    const appliesToBroadContext = [...notWeaponEquipment, data.weapon]
        .filter(equip => equip && equip.generateAdditionalContexts && broadContext in equip.generateAdditionalContexts)

    const reducer = appliesToBroadContext.reduce((acc, equip) => {
        // we ensured this exists already (logically) (ts does not know this)
        const broad = equip.generateAdditionalContexts as NonNullable<BaseEquipment['generateAdditionalContexts']>

        // should run the mod function instead of just having mod a number eventually
        const entry = broad[broadContext]!
        const doesApply = entry.applies(context)
        if (doesApply) return acc + entry.mod(data)
        return acc
    }, mod)

    return reducer
}