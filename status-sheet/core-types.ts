import type { SaveType } from "../save"
import { FeatContext, FeatModRequiredData } from "../feat/core-types"
import type { TriggerHooks } from "../trigger/core-types"
import type { InterceptRollFunction } from "../roll-intercept"
import type { CharacterSheet } from "../character-sheet"
import type { EquipmentSheet } from "../equipment-sheet"
import type { FeatSheet } from "../feat"
import type { StatusSheet } from "./types"

export type StatusExpirationSpeedElapsed = {
    kind: 'speed-elapsed',
    remaining: number,
}

export type StatusExpirationActionsElapsed = {
    kind: 'actions-elapsed',
    remaining: number,
}

export type StatusExpirationSaveSucceeded = {
    kind: 'save-succeeded',
    // changes which characterSheet vals are used for bonuses
    saveType: SaveType,
    dc: number,
}

export type StatusExpirationEnemyKilled = {
    kind: 'enemy-killed',
    // structural, not Actor/Owner, to avoid a circular import between status-sheet and character/actor
    enemy: { health: { curr: number } },
}

export type HealthTickResult = {
    kind: 'heal' | 'damage',
    amount: number,
}

export type TickOwnerData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

// decremented once per round, in simulate/index.ts's round loop - unlike speed-elapsed (initiative-order-based) or actions-elapsed (per action taken)
export type StatusExpirationRoundsElapsed = {
    kind: 'rounds-elapsed',
    remaining: number,
    // ex: for heal over time or damage over time
    // they have access to Owner so feats/status/equipment can affect
    // CURRENTLY WE ASSUME ONLY THIS STATUS TYPE HAS TICKS
    tick?: (data: TickOwnerData) => HealthTickResult,
}

export type StatusExpiration =
    | StatusExpirationSpeedElapsed
    | StatusExpirationActionsElapsed
    | StatusExpirationSaveSucceeded
    | StatusExpirationEnemyKilled
    | StatusExpirationRoundsElapsed

export type StatusPersistTypes = {
    afterBattle: boolean,
}

// a status effect's buffs/debuffs are Feat-shaped: same whitelist/blacklist-driven
// context system, just with an expiration layered on top
export type StatusEffect = {
    displayName: string,
    description?: string,
    context: FeatContext,
    expiration: StatusExpiration,
    // lets one status chain into another on expiry (e.g. a "charging up" status
    // that turns into the actual buff once its rounds run out)
    onExpiration?: (data?: Partial<FeatModRequiredData>) => StatusEffect | undefined,
    // see TriggerHooks (trigger/core-types.ts) - same reactive hooks as Feat,
    // so an active status can also respond to the outcome of an attack
    trigger?: TriggerHooks,
    // see InterceptRollFunction (roll-intercept/index.ts) - lets a status intercept
    // and rewrite the roll itself, before hit/miss is resolved from it
    interceptRoll?: InterceptRollFunction,
    persists?: Partial<StatusPersistTypes>
}
