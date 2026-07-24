import { ModNode } from "../..";
import { Owner } from "../../../../character/actor";
import { BaseEquipment } from "../../../../equipment-sheet";

// the feat sheet, native. loose string keys like StatusSheet - the collector reads values, not keys
export type FeatSheetMaximal = { [key: string]: FeatMaximal }

// the status sheet, native (StatusEffectMaximal). same loose-key shape as the feat sheet
export type StatusSheetMaximal = { [key: string]: StatusEffectMaximal }

// the maximal amount of information we could every possibly need because we don't know what we're building.
// same owner as legacy, but the feat and status sheets are native instead of the old legacy sheets
export type OwnerMaximal = Omit<Owner, 'fs' | 'ss'> & { fs: FeatSheetMaximal, ss: StatusSheetMaximal, relevantSlot?: BaseEquipment }

// curated subset of tree nodes a status is allowed to attach to (an aggregator, not any internal node)
export type BroadContextsMaximal = 'dex-from-status' | 'str-from-status' | 'max-dex-of-equipment' | 'attack-status-mod' | 'ac-status-mod' | 'damage-taken-status-mod' | BaseStatEquipmentMod

// a producer returns undefined when the status is on the sheet but doesn't apply here (e.g. a melee-only
// attack status with a ranged weapon); the collector drops those, same as feats.
export type StatusEffectMaximal = {
    displayName: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode | undefined>>
}

export type EquipmentMaximal = {
    displayName: string,
    description?: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode>>
}

// feats route natively exactly like statuses, only into their own aggregator nodes. A feat declares
// which node it feeds and returns the ModNode to inject; the destination node discovers it via
// collectFeatContributions (presence on owner.fs is the condition, same as statuses on owner.ss).
export type FeatBroadContexts =
    | 'attack-feat-mod' | 'ac-feat-mod' | 'crit-confirm-mod'
    // damage splits into two buckets by crit-eligibility: a feat picks its bucket by which key it
    // declares. 'crit-scalable-*' is eligible to be multiplied by the crit multiplier; 'flat-*' is
    // added on afterward and never scales.
    | 'crit-scalable-damage-feat-mod' | 'flat-damage-feat-mod'
    | 'crit-multiplier-mod'
    // crit threat range: negative widens the range (Improved Critical takes a 20 down to 19)
    | 'crit-threat-range-mod'
    // defender-side: mods applied to incoming damage (DR, defensive rolls, etc.)
    | 'damage-taken-feat-mod'

// a producer returns undefined when the feat is on the sheet but doesn't apply here (e.g. a finesse
// feat with a non-finesse weapon); the collector drops those so they leave no trace in the outline.
export type FeatMaximal = {
    displayName: string,
    broadContexts: Partial<Record<FeatBroadContexts, (owner: OwnerMaximal) => ModNode | undefined>>
}

export type AllFeats =
    | 'finesse-weapon-fighting' | 'melee-weapon-fighting'
    | 'dodgy' | 'shield-mastery' | 'heavy-armor-mastery' | 'crit-focus'
    | 'improved-critical'

export type AllStatusEffects = 'cats-grace' | 'flat-footed'

export type CsScore = 'str' | 'dex' | 'con'

export type BaseStat = `raw-${CsScore}`     // 'raw-str' | 'raw-dex' | 'raw-con'

export type BaseStatStatusMod = `status-modded-${CsScore}`

export type BaseStatEquipmentMod = `equipment-modded-${CsScore}`

export type ModdedStat = `modded-${CsScore}` // 'modded-str' | 'modded-dex' | 'modded-con'

export type FeatModTypes = 'attack' | 'ac'
export type FeatMod = `${FeatModTypes}-feat-mod`

export type EveryTree =
    // base
    BaseStat
    | BaseStatStatusMod
    | BaseStatEquipmentMod
    | ModdedStat
    | AllStatusEffects
    | 'base-ac'
    // composition
    | FeatMod
    | 'max-dex-of-equipment'
    | 'ac-of-equipment'
    | 'ac-from-dex'
    | 'dex-from-status'
    | 'str-from-status'
    | 'effective-attack-stat'
    | 'effective-damage-stat'
    | 'base-attack-bonus'
    | 'attack-status-mod'
    | 'attack-equipment-mod'
    | 'ac-status-mod'
    | 'crit-confirm-mod'
    // crit damage composition
    | 'crit-scalable-damage'
    | 'flat-damage'
    | 'crit-scalable-damage-feat-mod'
    | 'flat-damage-feat-mod'
    | 'crit-multiplier'
    | 'crit-multiplier-mod'
    // crit threat range composition
    | 'crit-threat-range-mod'
    // damage-taken composition (defender side)
    | 'damage-taken-feat-mod'
    | 'damage-taken-status-mod'
    // terminal
    | 'ac'
    | 'attack'
    | 'crit-confirm'
    | 'crit-threat-range'
    | 'damage'
    | 'crit-damage'
    | 'damage-taken'

export type TreeSubproblems = Partial<Record<EveryTree, ModNode>>