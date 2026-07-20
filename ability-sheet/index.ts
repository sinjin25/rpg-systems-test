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
    const isNew = !category.items[key]
    category.items[key] = ability

    // if ability is new, add it to the end of the priority queue
    if (isNew) category.priority.push(key)
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
