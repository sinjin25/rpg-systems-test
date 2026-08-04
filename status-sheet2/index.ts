import { OwnerMaximal } from "../actor2"
import { SnapshotStatusEffect, StatusEffect, StatusSheet } from "./types"

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

export const defaultStatusSheet: StatusSheet = {}

// this is done to normalize adding snapshots and statuses to a sheet
export const addStatusToStatusSheet = (owner: OwnerMaximal, ...statuses: Array<StatusEffect | SnapshotStatusEffect>) => {
    const ss = owner.ss
    for (const status of statuses) {
        if (typeof status === 'function') {
            const st = status({
                snapshot: owner,
            })
            ss[st.displayName] = st
        } else {
            ss[status.displayName] = status
        }
    }
}