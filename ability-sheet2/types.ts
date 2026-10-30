import { AbilitySheetDefinition } from "./abilities2/types"
import { AttackAbilitySheetDefinition } from "./attack-ability/types"

export type AbilityCastType = 'standard' | 'swift' | 'free'

export type AbilityTags = string[]

// a category can hold either kind of ability; the `kind` discriminant distinguishes them
export type AnyAbilitySheetDefinition = AbilitySheetDefinition | AttackAbilitySheetDefinition

export type AbilityCatalog = Record<string, AnyAbilitySheetDefinition>

// do-a-lot is test-only; excluded on purpose (mirrors feat2's testFeatMeleeWeaponFighting)
export type AbilityIdsTest =
    | 'ignite'
    | 'Studied Target'
    | 'normal attack'

export type AbilityCategory = {
    items: AbilityCatalog,
    // ability usage order for category
    // member = items[key]
    priority: Array<string>,
    // priority cursor
    index: number,
}

// sub-categorized by action economy type
export type AbilitySheet = Record<AbilityCastType, AbilityCategory>
