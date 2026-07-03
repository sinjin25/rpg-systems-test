import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet, Weapon } from "../equipment-sheet"
import { FeatSheet } from "../feat"

export type RollModifierRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: EquipmentSheet,
    statusSheet: {},
    weapon: Weapon,
}

export type RollModifierFunc = () => number

export type RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => RollModifierFunc
