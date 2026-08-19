import { ObjectWithBroadContexts } from "../log2/types"
import { OwnerMaximal } from "../actor2"
import { ModNode } from "../log2"
import { StatusExpiration, StatusPersistTypes } from "./decay/types"

export type {
    StatusExpirationSpeedElapsed,
    StatusExpirationActionsElapsed,
    StatusExpirationSaveSucceeded,
    StatusExpirationEnemyKilled,
    StatusExpirationRoundsElapsed,
    StatusExpiration,
    StatusPersistTypes,
    DecayOwner,
    DecaySaveSucceededLog,
} from "./decay/types"

// base re-rolls each tick; mod is the source-side contribution, frozen at apply time
export type TickCalc = {
    base: () => ModNode,
    mod: (source: OwnerMaximal) => ModNode,
}

export type Tick = {
    calculateDamage?: TickCalc,
    calculateHeal?: TickCalc,
}

// the resolved form stored on an instance: mod has been evaluated against the source
export type ResolvedTickCalc = {
    base: () => ModNode,
    mod: ModNode,
}

export type ResolvedTick = {
    calculateDamage?: ResolvedTickCalc,
    calculateHeal?: ResolvedTickCalc,
}

export type StatusEffectStack = {
    // default is 'highest'
    kind: 'stack' | 'highest' | 'refresh'
}

export type StatusEffectInstance = {
    source: OwnerMaximal,
    expiration?: StatusExpiration
    pointer: StatusEffect
    tick?: ResolvedTick
}

export type StatusEffectInstanceFactory = (source: OwnerMaximal) => StatusEffectInstance

export type StatusEffect = {
    displayName: string,
    description?: string,
    broadContexts: ObjectWithBroadContexts['broadContexts']
    onExpiration?: (data?: Partial<OwnerMaximal>) => StatusEffectWrapper | undefined,
    persists?: Partial<StatusPersistTypes>
    tick?: Tick
    stack: StatusEffectStack
}

export type StatusEffectWrapper = StatusEffect & {
    factory: StatusEffectInstanceFactory
}

export type StatusSheet = Record<string, StatusEffectInstance[]>
