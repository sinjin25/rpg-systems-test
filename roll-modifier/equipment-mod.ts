import { BroadContexts, ContextNames } from "../contexts";
import { FeatSheet } from "../feat";
import { CharacterSheet } from "../character-sheet";
import { equipmentIsWeapon, EquipmentSheet, Weapon } from "../equipment-sheet";
import calculateEquipmentMod from "../equipment-sheet/equipment-mod";

export type CalculateEquipmentModRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: EquipmentSheet,
    // only the relevant weapon is counted
    weapon: Weapon,
}

export const calculateWeaponEquipmentMod = (
    data: CalculateEquipmentModRequiredData,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    const notWeaponEquipment = Object.values(data.equipmentSheet)
        .filter(a => {
            return !(equipmentIsWeapon(a))
        })

    const relevantEquipment = [...notWeaponEquipment, data.weapon]

    return calculateEquipmentMod(
        relevantEquipment,
        data,
        context,
        broadContext,
    )
}
