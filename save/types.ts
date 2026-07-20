import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { FeatModRequiredData } from "../feat/feats"
import { RollModifierFunc, RollModifierFuncFactory, RollModifierRequiredData } from "../roll-modifier/types"
import { StatusSheet } from "../status-sheet"

export type SaveType = 'fortitude' | 'reflex'

export type SaveModifierRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

export type SaveModifierFunc = RollModifierFunc

export type SaveModifierFuncFactory = (
    data: SaveModifierRequiredData,
) => SaveModifierFunc
