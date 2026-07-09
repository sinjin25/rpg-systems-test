import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet, Weapon } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { StatusSheet } from "../status-sheet"
import { ModGroup } from "../stat-modifier/log"

export type RollModifierRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
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
