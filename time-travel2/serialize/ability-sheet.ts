import registry from "../../ability-sheet2/registry"
import { AbilityCastType, AbilityCategory, AbilitySheet, AbilityCatalog } from "../../ability-sheet2/types"

export type FrozenAbilityCategory = {
    priority: string[],
    index: number,
}

export type FrozenAbilitySheet = Record<AbilityCastType, FrozenAbilityCategory>

// items is keyed by displayName (see ability-sheet2/index's addAbility), so priority+index alone
// is a complete, JSON-safe description; deserializing re-indexes into the registry - same
// pattern as serialize/deserializeFeatSheet.
const serializeCategory = (cat: AbilityCategory): FrozenAbilityCategory => ({
    priority: [...cat.priority],
    index: cat.index,
})

export const serializeAbilitySheet = (as: AbilitySheet): FrozenAbilitySheet => ({
    free: serializeCategory(as.free),
    standard: serializeCategory(as.standard),
    swift: serializeCategory(as.swift),
})

// fallback is used for things like testing (ex: pass in owner.as.<category>.items) or a
// consumer's own full ability catalog (e.g. rpg-content's abilities/registry); you should
// rarely need to do this
const deserializeCategory = (frozen: FrozenAbilityCategory, fallback?: AbilityCatalog): AbilityCategory => ({
    items: Object.fromEntries(
        frozen.priority.map(id => [id, registry[id as keyof typeof registry] ?? fallback?.[id]])
    ),
    priority: [...frozen.priority],
    index: frozen.index,
})

export const deserializeAbilitySheet = (frozen: FrozenAbilitySheet, fallback?: AbilityCatalog): AbilitySheet => ({
    free: deserializeCategory(frozen.free, fallback),
    standard: deserializeCategory(frozen.standard, fallback),
    swift: deserializeCategory(frozen.swift, fallback),
})
