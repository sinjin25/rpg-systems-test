import { ContextNames } from "../contexts"
import { FeatModFunction } from "../feat/core-types"
import { SaveType } from "../save"
import { StatusEffect } from "../status-sheet/core-types"

export type AbilityKeyStat = 'str' | 'dex' | 'con'

export type AbilityCastType = 'standard' | 'swift' | 'free'

export type AbilitySaveDamageOutcome = 'full' | 'half' | 'none'

export type AbilitySave = {
    type: SaveType,
    baseDc: number,
    damageOnPass: AbilitySaveDamageOutcome,
}

export type Ability = {
    displayName: string,
    keyStat: AbilityKeyStat,
    castType: AbilityCastType,
    contexts: ContextNames[],
    damage?: FeatModFunction,
    // a save is optional
    save?: AbilitySave,
    onFailedSave?: (dc: number) => StatusEffect,
    // no dex save. Can technically use dc99 but generates logs
    onUse?: () => StatusEffect,
}


export type AbilityCatalog = Record<string, Ability>

export type AbilityCategory = {
    items: AbilityCatalog,
    // ability usage order for category
    // member = items[key]
    priority: Array<string>,
    // priority cursor
    index: number,
}

// keyed by castType so each action-economy slot has its own catalog/priority
export type AbilitySheet = Record<AbilityCastType, AbilityCategory>