import { CsScore, EveryTree } from "../../log2/types"
import type { BaseEquipment, EquipmentSlot } from "../types"

export type EquipmentForFactory = {
    kind: EquipmentSlot,
}

export type LookupTableValue = {
    weight: number,
    max: number,
    min: number,
}

export type EquipmentMHForFactory = {
    kind: 'mainhand',
    affix: WeaponAffix[],
    suffix: WeaponSuffix[],
}

type EquipmentModifierRoll = {
    rank: number, // 0-X where 0 is "the best rank"
    perfection: number, // 0-100
}

export type ModKind =
    | 'ac'
    | 'attack'
    | 'flat-damage'
    | 'roll-damage'
    | 'crit-threat-range'
    | 'crit-multiplier'
    | CsScore
    | 'speed'
    | 'initiative'
    | 'dr'
    | 'health'
    | 'fortitude'
    | 'will'
    | 'reflex'
    | 'dc'

// Record<ModKind, true> lets each slot's affix/suffix/implicit carve out its subset with
// Pick — a kind dropped from ModKind (typo'd or removed) fails to compile here instead of
// silently drifting out of sync.
type AllMods = Record<ModKind, true>

export type WeaponImplicitKind = keyof Pick<AllMods,
    'ac' | 'attack' | 'flat-damage'>
export type WeaponAffixKind = keyof Pick<AllMods,
    'crit-threat-range' | 'flat-damage' | 'roll-damage' | 'attack' | 'ac'>
export type WeaponSuffixKind = keyof Pick<AllMods,
    'crit-multiplier' | CsScore | 'speed' | 'initiative'>
export type TwohandAffixKind = WeaponSuffixKind
export type TwohandSuffixKind = WeaponSuffixKind
export type ArmorAffixKind = keyof Pick<AllMods,
    'ac' | 'dr' | 'health' | 'initiative'>
export type ArmorSuffixKind = keyof Pick<AllMods,
    CsScore | 'fortitude' | 'will' | 'reflex'>
export type RingAffixKind = keyof Pick<AllMods,
    'health' | 'speed' | 'initiative' | 'crit-threat-range' | 'crit-multiplier' | CsScore | 'dc'>
export type RingSuffixKind = keyof Pick<AllMods,
    'health' | 'initiative' | 'fortitude' | 'will' | 'reflex'>
export type AmuletAffixKind = RingAffixKind
export type AmuletSuffixKind = RingSuffixKind

export type WeaponImplicit = {
    kind: WeaponImplicitKind,
}

export type WeaponAffix = {
    kind: WeaponAffixKind,
} & EquipmentModifierRoll

export type WeaponSuffix = {
    kind: WeaponSuffixKind,
} & EquipmentModifierRoll

export type TwohandAffix = {
    kind: TwohandAffixKind,
} & EquipmentModifierRoll

export type TwohandSuffix = {
    kind: TwohandSuffixKind,
} & EquipmentModifierRoll

export type ShieldAffix = {
    kind: '',
} & EquipmentModifierRoll

export type ShieldSuffix = {
    kind: '',
} & EquipmentModifierRoll

// consider special mods (ghost-touch, finesse, etc.)

export type ArmorAffix = {
    kind: ArmorAffixKind,
}

export type ArmorSuffix = {
    kind: ArmorSuffixKind,
}

export type RingAffix = {
    kind: RingAffixKind,
} & EquipmentModifierRoll

export type RingSuffix = {
    kind: RingSuffixKind,
} & EquipmentModifierRoll

export type AmuletAffix = {
    kind: AmuletAffixKind,
} & EquipmentModifierRoll

export type AmuletSuffix = {
    kind: AmuletSuffixKind,
} & EquipmentModifierRoll

export type EquipmentBlueprintModifier = {
    kind: ModKind,
    rank: number,
    perfection: number,
}

export type EquipmentBlueprintBaseItem = {
    name: string
    base: BaseItemLookupValue['base'],
    implicit: EquipmentBlueprintImplicit[],
    damageDiceSides?: BaseItemLookupValue['damageDiceSides'],
}

// does not have ranges or multiple ranks
// includes some special cases like damage broadContext (see broad-context-adapter)
export type EquipmentBlueprintImplicit = {
    kind: ModKind,
    value: number,
}

export type BaseItemLookupValue = {
    weight: number,
    base: BaseEquipment,
    implicit: EquipmentBlueprintImplicit[],
    // base weapon's own damage die (ex: longsword -> 8). Generated into the `damage` broadContext
    // by blueprintToBaseEquipment instead of being hand-written as a closure on `base`.
    damageDiceSides?: number,
}

export type EquipmentBlueprint = {
    slot: EquipmentSlot,
    base?: EquipmentBlueprintBaseItem,
    affix: EquipmentBlueprintModifier[],
    suffix: EquipmentBlueprintModifier[]
}

export type RollDamageSource = {
    label: string,
    sides: number,
}