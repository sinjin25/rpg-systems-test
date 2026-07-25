import { ModNode } from ".";
import { Owner } from "../character/actor";
import { BaseEquipment } from "../equipment-sheet";

export type FeatSheetMaximal = { [key: string]: FeatMaximal }

export type StatusSheetMaximal = { [key: string]: StatusEffectMaximal }

export type OwnerMaximal = Omit<Owner, 'fs' | 'ss'> & { fs: FeatSheetMaximal, ss: StatusSheetMaximal, relevantSlot?: BaseEquipment }

// specific tags for collector functions
export type BroadContextsMaximal = 'dex-from-status' | 'str-from-status' | 'con-from-status' | 'max-dex-of-equipment' | 'attack-status-mod' | 'ac-status-mod' | 'save-status-mod' | 'damage-taken-status-mod' | `equipment-modded-${CsScore}`

export type StatusEffectMaximal = {
    displayName: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode | undefined>>
}

export type EquipmentMaximal = {
    displayName: string,
    description?: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode>>
}

export type FeatBroadContexts =
    | 'attack-feat-mod' | 'ac-feat-mod' | 'crit-confirm-mod'
    | 'crit-scalable-damage-feat-mod' | 'flat-damage-feat-mod'
    | 'crit-multiplier-mod'
    | 'crit-threat-range-mod'
    | 'damage-taken-feat-mod'
    | 'save-feat-mod'
    | 'initiative-feat-mod'
    | 'health-feat-mod'

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
export type SaveModSources = 'save-feat-mod'
    | 'save-status-mod'
    | 'save-equipment-mod'

export type CsScore = 'str' | 'dex' | 'con'

export type BaseStateMod = `raw-${CsScore}`
    | `status-modded-${CsScore}`
    | `equipment-modded-${CsScore}`
    | `modded-${CsScore}`
    | `${CsScore}-from-status`

export type FeatModTypes = 'attack' | 'ac' | 'initiative' | 'health' | 'flat-damage' | 'crit-scalable-damage' | 'damage-taken'
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
    | 'attack-equipment-mod'
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