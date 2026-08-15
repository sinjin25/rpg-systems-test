import { OwnerMaximal } from "../actor2"
import { SnapshotStatusEffect, StatusEffect } from "./types"

export const getStatusKey = (status: StatusEffect) => status.displayName

// this is done to normalize adding snapshots and statuses to a sheet
export const addStatusToStatusSheet = (owner: OwnerMaximal, ...statuses: Array<StatusEffect | SnapshotStatusEffect>) => {
    const ss = owner.ss
    for (const status of statuses) {
        if (typeof status === 'function') {
            const st = status({
                snapshot: owner,
            })
            ss[getStatusKey(st)] = st
        } else {
            ss[getStatusKey(status)] = status
        }
    }
}
