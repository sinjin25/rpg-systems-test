import { BroadContexts, ContextNames } from "../../contexts";
import applyContextMod from "../../contexts/apply-context-mod";
import { FeatSheet } from "../../feat";
import { CharacterSheet } from "../../character-sheet";
import { equipmentIsWeapon, EquipmentSheet, Weapon } from "../../equipment-sheet";

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
    const notWeaponEquipment = Object.values(data.equipmentSheet)
        .filter(a => {
            return !(equipmentIsWeapon(a))
        })

    const relevantEquipment = [...notWeaponEquipment, data.weapon]

    return applyContextMod(
        relevantEquipment,
        equip => equip?.generateAdditionalContexts,
        data,
        context,
        broadContext,
    )
}