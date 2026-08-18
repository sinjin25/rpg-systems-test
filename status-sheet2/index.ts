import { StatusSheet } from "./types"

export type {
    StatusEffect,
    StatusExpiration,
    StatusExpirationSpeedElapsed,
    StatusExpirationActionsElapsed,
    StatusExpirationSaveSucceeded,
    StatusExpirationEnemyKilled,
    StatusExpirationRoundsElapsed,
    StatusPersistTypes,
    StatusSheet,
    Tick,
    TickCalc,
    ResolvedTick,
    ResolvedTickCalc,
    StatusEffectInstance,
    StatusEffectInstanceFactory,
    StatusEffectWrapper,
    StatusEffectStack,
} from "./types"
export * from "./status"
export * from "./add-status-to-status-sheet"
export * from "./instance"

export const defaultStatusSheet: StatusSheet = {}
