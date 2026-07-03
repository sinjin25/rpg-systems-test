import { CharacterSheet, DEFAULT_STAT } from "../character-sheet"
import { EquipmentSheet, Weapon } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { ContextNames } from "../feat/feats"
import calculateBaseMod from "./base-mod"
import calculateFeatMod from "./feat-mod"

export interface Attack {
    // the base modifiers (before roll, enemy, circumstance, etc.)
    calculateAttackModifier: AttackModifierFunc,
}

export type AttackModifierRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: FeatSheet,
    equipmentSheet: EquipmentSheet,
    statusSheet: {},
    weapon: Weapon,
}

export type AttackModifierFunc = () => number

export type AttackModifierFuncFactory = (
    data: AttackModifierRequiredData,
) => AttackModifierFunc

