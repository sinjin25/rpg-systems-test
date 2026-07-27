import { ModNode } from ".";
import { Owner } from "../character/actor";

/* export type FeatSheetMaximal = { [key: string]: FeatMaximal }

export type StatusSheetMaximal = { [key: string]: StatusEffectMaximal } */
export type BaseEquipment = {
    tags?: string[], // ex: ['finesse', 'melee']
} & ObjectWithBroadContexts
export type EquipmentSlot = 'mainhand' | 'offhand' | 'twohanded' | 'armor' | 'ring' | 'amulet'
export type EquipmentSheet = {
    [K in EquipmentSlot]?: BaseEquipment
}

export type OwnerMaximal = Omit<Owner, 'fs' | 'ss' | 'es'> &
{
    fs: Record<string, ObjectWithBroadContexts>,
    ss: Record<string, ObjectWithBroadContexts>,
    es: EquipmentSheet,
    relevantSlot?: BaseEquipment

}

// specific tags for collector functions
/* export type BroadContextsMaximal = 'dex-from-status' | 'str-from-status' | 'con-from-status' | 'max-dex-of-equipment' | 'attack-status-mod' | 'ac-status-mod' | 'save-status-mod' | 'damage-taken-status-mod' | `equipment-modded-${CsScore}` */

/* export type StatusEffectMaximal = {
    displayName: string,
    description?: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode | undefined>>
}

export type EquipmentMaximal = {
    displayName: string,
    description?: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode>>
} */

export type ObjectWithBroadContexts = {
    displayName: string,
    broadContexts: Partial<Record<EveryTree, (owner: OwnerMaximal) => ModNode | undefined>>
}

export type FeatMaximal = {
    displayName: string,
    broadContexts: Partial<Record<FeatBroadContexts, (owner: OwnerMaximal) => ModNode | undefined>>
}

export type AllFeats =
    | 'finesse-weapon-fighting' | 'melee-weapon-fighting'
    | 'dodgy' | 'shield-mastery' | 'heavy-armor-mastery' | 'crit-focus'
    | 'improved-critical'

export type AllStatusEffects = 'cats-grace' | 'flat-footed'

export type Saves = 'fortitude' | 'will' | 'reflex'
export type BaseSaves = `base-${Saves}`
export type SaveModSources = `${Saves}-feat-mod`
    | `${Saves}-status-mod`
    | `${Saves}-equipment-mod`

export type CsScore = 'str' | 'dex' | 'con'

export type BaseStateMod = `raw-${CsScore}`
    | `status-modded-${CsScore}`
    | `${CsScore}-from-equipment`
    | `modded-${CsScore}`
    | `${CsScore}-from-status`
    | `${CsScore}-total` // after all modifiers
export type FeatModTypes = 'attack' | 'damage' | 'ac' | 'initiative' | 'health' | 'flat-damage' | 'crit-scalable-damage' | 'damage-taken' | 'max-dex'
export type FeatMod = `${FeatModTypes}-feat-mod`

// from terminal/ these are end results
export type TerminalRoutes = 'ac'
    | 'attack'
    | 'fortitude'
    | 'reflex'
    | 'crit-confirm'
    | 'crit-threat-range'
    | 'damage'
    | 'crit-damage'
    | 'damage-taken'
    | 'health'
    | 'initiative'

export type EveryTree =
    BaseStateMod
    | AllStatusEffects
    | 'base-ac'
    | BaseSaves
    // composition
    | FeatMod
    | 'max-dex-of-equipment'
    | 'ac-of-equipment'
    | 'ac-from-dex'
    | 'effective-attack-stat'
    | 'effective-damage-stat'
    | 'base-attack-bonus'
    | 'attack-status-mod'
    | 'attack-from-equipment'
    | 'ac-status-mod'
    | 'crit-confirm-mod'
    | SaveModSources
    | 'crit-scalable-damage'
    | 'flat-damage'
    | 'crit-multiplier'
    | 'crit-multiplier-mod'
    | 'crit-threat-range-mod'
    | 'damage-taken-status-mod'
    // terminal
    | TerminalRoutes

export type TreeSubproblems = Partial<Record<EveryTree, ModNode>>

type Subset<T, U extends T> = U
export type FeatBroadContexts = Subset<EveryTree,
    | 'attack-feat-mod'
    | 'ac-feat-mod'
    | 'crit-confirm-mod'
    | 'crit-scalable-damage-feat-mod'
    | 'flat-damage-feat-mod'
    | 'crit-multiplier-mod'
    | 'crit-threat-range-mod'
    | 'damage-taken-feat-mod'
    | 'damage-feat-mod'
    | 'initiative-feat-mod'
    | 'health-feat-mod'
    | 'max-dex-feat-mod'
    | `${Saves}-feat-mod`
>

export type StatusBroadContexts = Subset<EveryTree,
    /* | 'dex-from-status'
    | 'str-from-status'
    | 'con-from-status' */
    | 'max-dex-of-equipment'
    | 'attack-status-mod'
    | 'ac-status-mod'
    | `${Saves}-status-mod`
    | 'damage-taken-status-mod'
>