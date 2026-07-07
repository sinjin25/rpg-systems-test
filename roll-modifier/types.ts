import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet, Weapon } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { ModGroup } from "../stat-modifier/log"

export type RollModifierRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: EquipmentSheet,
    statusSheet: {},
    weapon: Weapon,
}

export type RollModifierResult = {
    total: number,
    groups: ModGroup[],
}

export type RollModifierFunc = () => RollModifierResult

export type RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => RollModifierFunc
