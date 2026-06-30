import { CharacterSheet, DEFAULT_STAT } from "../character-sheet"

export interface Attack {
    // the base modifiers (before roll, enemy, circumstance, etc.)
    calculateAttackModifier: AttackModifierFunc,
}

export type AttackModifierRequiredData = {
    characterSheet: CharacterSheet,
    featSheet: {},
    equipmentSheet: {},
    statusSheet: {},
}

export type AttackModifierFunc = () => number

export type AttackModifierFuncFactory = (
    data: AttackModifierRequiredData,
) => AttackModifierFunc

