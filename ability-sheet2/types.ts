import type { AbilitySheetDefinition } from "./abilities2/types"
import type { AttackAbilitySheetDefinition } from "./attack-ability/types"

export type AbilityCastType = 'standard' | 'swift' | 'free'

export type AbilityTags = string[]

// a category can hold either kind of ability; the `kind` discriminant distinguishes them
export type AnyAbilitySheetDefinition = AbilitySheetDefinition | AttackAbilitySheetDefinition

export type AbilityCatalog = Record<string, AnyAbilitySheetDefinition>

// do-a-lot is test-only; excluded on purpose (mirrors feat2's testFeatMeleeWeaponFighting).
// rpg-content defines its own ability files but no type of its own — this is the complete
// catalog of every known ability id, content abilities included, so rpg-tests stays the
// single source of truth rpg-content imports from.
export type AbilityIds =
    | 'ignite'
    | 'studiedTarget'
    | 'normalAttack'
    | 'cleave'
    | 'cadence'
    | 'cursingStrike'
    | 'enflamingStrike'
    | 'swordOfDamocles'
    | 'boneshatter'

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
