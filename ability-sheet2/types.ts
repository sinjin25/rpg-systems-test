import { OwnerMaximal } from "../actor2"
import { ModNode } from "../log2"
import { ObjectWithBroadContexts, Saves } from "../log2/types"
import { StatusEffect } from "../status-sheet2"

export type AbilityCastType = 'standard' | 'swift' | 'free'

export type AbilityTags = string[]

// there's a faulty assumption right now that a modnode should have a dc and a status effect never has a dc
// we will have to address this eventually
export type AbilityModNode = {
    dc?: ModNode,
    save?: ModNode,
    payload: ModNode | StatusEffect,
    target: 'ally' | 'target' | 'self'
}

// returns either StatusEffect or ModNode (which would probably get passed to some log2 handler)
export type Handlers = {
    onUse: () => AbilityModNode[],
    onSave: () => AbilityModNode[],
    onFailedSave: () => AbilityModNode[],
}

export type Ability = ObjectWithBroadContexts & {
    castType: AbilityCastType,
    handlers: Partial<Handlers>
    dc?: {
        // use by log2/terminal/dc
        saveType: 'reflex' | 'fortitude',
        baseDc: number,
        tags: AbilityTags
    }
}

export type SnapshotAbility = (owner: OwnerMaximal) => Ability

export type AbilityCatalog = Record<string, Ability>

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