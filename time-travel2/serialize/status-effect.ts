import registry from "../../status-sheet2/registry"
import { StatusEffect } from "../../status-sheet2/types"

export type FrozenStatusEffect = string

export const serializeStatusEffect = (se: StatusEffect): FrozenStatusEffect => se.id

// fallback is used for a consumer's own status catalog (e.g. rpg-content's statuses/registry)
// whose live registry differs from the one here; you should rarely need to do this
export const deserializeStatusEffect = (
    id: FrozenStatusEffect,
    fallback?: Record<string, StatusEffect>,
): StatusEffect => {
    return (registry[id as keyof typeof registry] ?? fallback?.[id]) as StatusEffect
}
