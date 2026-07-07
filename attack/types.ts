import { RollModifierFunc, RollModifierFuncFactory, RollModifierRequiredData } from "../roll-modifier/types"

export interface Attack {
    // the base modifiers (before roll, enemy, circumstance, etc.)
    calculateAttackModifier: AttackModifierFunc,
}

export type AttackModifierRequiredData = RollModifierRequiredData

export type AttackModifierFunc = RollModifierFunc

export type AttackModifierFuncFactory = RollModifierFuncFactory

