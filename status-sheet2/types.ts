import type { ObjectWithBroadContexts, ModNodeOpts } from "../log2/types"
import type { OwnerMaximal } from "../actor2/types"
import type { ModNode } from "../log2"
import type { StatusExpiration, StatusPersistTypes } from "./decay/types"

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
    base: (opts?: ModNodeOpts) => ModNode,
    mod: (source: OwnerMaximal) => ModNode,
}

export type Tick = {
    calculateDamage?: TickCalc,
    calculateHeal?: TickCalc,
}

// the resolved form stored on an instance: mod has been evaluated against the source
export type ResolvedTickCalc = {
    base: (opts?: ModNodeOpts) => ModNode,
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

export type StatusIds =
    | 'battleFocus'
    | 'battleFocusActive'
    | 'bearsEndurance'
    | 'bless'
    | 'bullsStrength'
    | 'burningWeapon'
    | 'catsGrace'
    | 'defensiveRoll'
    | 'divineProtection'
    | 'fatiguingBlows'
    | 'flatFooted'
    | 'ignite'
    | 'rage'
    | 'studiedTarget'

export type StatusEffect = {
    id: string,
    hidden: boolean,
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
