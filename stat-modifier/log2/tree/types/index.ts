import { ModNode } from "../..";
import { Owner } from "../../../../character/actor";

// the maximal amount of information we could every possibly need because we don't know what we're building
export type OwnerMaximal = Owner

// curated subset of tree nodes a status is allowed to attach to (an aggregator, not any internal node)
export type BroadContextsMaximal = 'dex-from-status' | 'str-from-status' | 'max-dex-of-equipment'

export type StatusEffectMaximal = {
    displayName: string,
    broadContexts: Partial<Record<BroadContextsMaximal, (owner: OwnerMaximal) => ModNode>>
}

export type AllStatusEffects = 'cats-grace' | 'flat-footed'

export type CsScore = 'str' | 'dex' | 'con'

export type BaseStat = `raw-${CsScore}`     // 'raw-str' | 'raw-dex' | 'raw-con'

export type BaseStatStatusMod = `status-modded-${CsScore}`

export type ModdedStat = `modded-${CsScore}` // 'modded-str' | 'modded-dex' | 'modded-con'

export type EveryTree =
    // base
    BaseStat
    | BaseStatStatusMod
    | ModdedStat
    | AllStatusEffects
    | 'base-ac'
    // composition
    | 'max-dex-of-equipment'
    | 'ac-of-equipment'
    | 'ac-from-dex'
    | 'dex-from-status'
    | 'str-from-status'
    | 'effective-attack-stat'
    | 'base-attack-bonus'
    | 'attack-feat-mod'
    | 'attack-status-mod'
    | 'attack-equipment-mod'
    // terminal
    | 'ac'
    | 'attack'

export type TreeSubproblems = Partial<Record<EveryTree, ModNode>>