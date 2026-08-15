import { ModNode } from ".";
import { OwnerMaximal } from "../actor2";
import { BaseEquipment, EquipmentSheet } from "../equipment-sheet2/types";
import { Tags } from "./tags";



// the structural contract log2 traversal needs: anything it can walk broadContexts on.
// the concrete assembled actor lives in actor2/ and is assignable to this.
/* export type OwnerLog2 = Omit<Owner, 'fs' | 'ss' | 'es' | 'as'> &
{
    fs: Record<string, ObjectWithBroadContexts>,
    ss: Record<string, ObjectWithBroadContexts>,
    es: EquipmentSheet,
    relevantSlot?: BaseEquipment
    tags: Tags[], // starts empty, a terminal tree should mutate it. Use the utility functions from tags.ts
} */
export type OwnerLog2 = Omit<OwnerMaximal, 'fs' | 'ss' | 'es' | 'as'> &
{
    fs: Record<string, ObjectWithBroadContexts>,
    ss: Record<string, ObjectWithBroadContexts>,
    es: EquipmentSheet,
    relevantSlot?: BaseEquipment
    tags: Tags[], // starts empty, a terminal tree should mutate it. Use the utility functions from tags.ts
}

export type ObjectWithBroadContexts = {
    displayName: string,
    broadContexts: Partial<Record<EveryTree, (owner: OwnerLog2) => ModNode | undefined>>
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

export type CsScore = 'str' | 'dex' | 'con' | 'int'

export type BaseStateMod = `raw-${CsScore}`
    | `status-modded-${CsScore}`
    | `${CsScore}-from-equipment`
    | `modded-${CsScore}`
    | `${CsScore}-from-status`
    | `${CsScore}-total` // after all modifiers
export type FeatModTypes = 'attack' | 'damage' | 'ac' | 'initiative' | 'health' | 'flat-damage' | 'crit-scalable-damage' | 'damage-taken' | 'max-dex' | 'damage-over-time' | 'damage-over-time-taken' | 'spell-dc'
export type FeatMod = `${FeatModTypes}-feat-mod`

type Health = 'base-health' | 'flat-health' | 'health-per-level' | 'health-equipment-mod' | 'base-health-per-level' | 'health-from-levels'
// | health-feat-mod (see Feats)

type RollTypes = 'roll' | 'attack' | 'damage' | 'dc' | 'roll-total'
export type RollSidesMod = `${RollTypes}-sides-mod`

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
    | 'maximum-health'
    | 'damage-over-time'
    | 'damage-over-time-taken'
    | 'roll-total'
    | 'dc'

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
    | 'effective-spell-dc-stat'
    | 'base-attack-bonus'
    | 'attack-status-mod'
    | 'attack-from-equipment'
    | 'ac-status-mod'
    | 'crit-confirm-mod'
    | 'crit-scalable-damage-status-mod'
    | 'spell-dc-status-mod'
    | 'spell-dc-from-equipment'
    | 'base-dc' // gotten from Ability
    | Health
    | 'levels'
    | SaveModSources
    | 'crit-scalable-damage'
    | 'flat-damage'
    | 'crit-multiplier'
    | 'crit-multiplier-mod'
    | 'crit-threat-range-mod'
    | 'damage-taken-status-mod'
    | 'enhancement' // used by attack, ac, damage, for equipment (mostly flavor)
    // terminal
    | TerminalRoutes
    | RollSidesMod

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
    | 'damage-over-time-feat-mod'
    | 'damage-over-time-taken-feat-mod'
    | 'spell-dc-feat-mod'
    | RollSidesMod
>

// convert this into a template literal soon
export type StatusBroadContexts = Subset<EveryTree,
    | 'max-dex-of-equipment'
    | 'attack-status-mod'
    | 'ac-status-mod'
    | `${Saves}-status-mod`
    | 'damage-taken-status-mod'
    | 'crit-scalable-damage-status-mod'
    | 'spell-dc-status-mod'
>