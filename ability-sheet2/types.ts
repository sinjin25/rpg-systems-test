import { AbilitySheetDefinition } from "./abilities2/types"

export type AbilityCastType = 'standard' | 'swift' | 'free'

export type AbilityTags = string[]

export type AbilityCatalog = Record<string, AbilitySheetDefinition>

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
