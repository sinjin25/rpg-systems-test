import { Ability, AbilityCategory } from "./types"
import { AbilitySheet } from "./types"

export type {
    Ability,
    AbilityCastType,
    AbilityKeyStat,
    AbilitySave,
    AbilitySaveDamageOutcome,
} from "./types"
export type { AbilityCatalog, AbilityCategory, AbilitySheet } from "./types"

export const getAbilityKey = (ability: Ability) => ability.displayName

export const addAbility = (
    as: AbilitySheet,
    ability: Ability,
) => {
    const category = as[ability.castType]

    const key = getAbilityKey(ability)
    category.items[key] = ability

    // assume the user added this because they want to use it
    category.priority.push(key)
}

export const createAbilityCategory = (): AbilityCategory => ({
    items: {},
    priority: [],
    index: 0,
})

export const createDefaultAbilitySheet = (): AbilitySheet => ({
    standard: createAbilityCategory(),
    swift: createAbilityCategory(),
    free: createAbilityCategory(),
})
