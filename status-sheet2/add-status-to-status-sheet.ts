import type { OwnerMaximal } from "../actor2/types"
import { newStatusInstance } from "./instance"
import type { StatusEffect, StatusEffectWrapper } from "./types"

export const getStatusKey = <S extends { id: string }>(status: S): S['id'] => status.id

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
