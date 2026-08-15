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
    SnapshotStatusEffect,
} from "./types"
export * from "./status"
export * from "./add-status-to-status-sheet"

export const defaultStatusSheet: StatusSheet = {}
