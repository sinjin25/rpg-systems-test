import type { OwnerMaximal, Actor2 } from "../../actor2/types"
import type { EquipmentBlueprint } from "../../equipment-sheet2/factory/types"
import type { EquipmentSlot } from "../../equipment-sheet2/types"
import type {
    StatusExpirationSaveSucceeded,
    ResolvedTickCalc,
    StatusEffectInstance,
} from "../../status-sheet2"
import type { FrozenModNode } from "../types"

export type FrozenEquipmentSheet = { [K in EquipmentSlot]?: EquipmentBlueprint }

export type OwnerMaximalSnapshot = Omit<OwnerMaximal, 'es' | 'ss'> & {
    es: FrozenEquipmentSheet
    ss: Record<string, FrozenStatusEffectInstance[]>
}

export type Actor2Snapshot = Omit<Actor2, 'owner'> & { owner: OwnerMaximalSnapshot }

export type FrozenStatusExpiration =
    | Exclude<NonNullable<StatusEffectInstance['expiration']>, StatusExpirationSaveSucceeded>
    | (Omit<StatusExpirationSaveSucceeded, 'dc'> & { dc: FrozenModNode })

export type FrozenResolvedTickCalc = Omit<ResolvedTickCalc, 'mod'> & { mod: FrozenModNode }

export type FrozenResolvedTick = {
    calculateDamage?: FrozenResolvedTickCalc
    calculateHeal?: FrozenResolvedTickCalc
}

export type FrozenStatusEffectInstance = Omit<StatusEffectInstance, 'expiration' | 'tick'> & {
    expiration?: FrozenStatusExpiration
    tick?: FrozenResolvedTick
}
