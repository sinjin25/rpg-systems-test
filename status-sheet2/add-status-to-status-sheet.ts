import { OwnerMaximal } from "../actor2"
import { newStatusInstance } from "./instance"
import { StatusEffect, StatusEffectWrapper } from "./types"

export const getStatusKey = (status: StatusEffect) => status.displayName

// this is done to normalize adding snapshots and statuses to a sheet
export const addStatusToStatusSheet = (owner: OwnerMaximal, creator: OwnerMaximal | undefined, ...statuses: Array<StatusEffectWrapper>) => {
    const ss = owner.ss
    for (const status of statuses) {
        const key = getStatusKey(status)
        if (ss[key] === undefined) ss[key] = []
        ss[key].push(
            newStatusInstance(status, creator || owner)
        )
    }
}
