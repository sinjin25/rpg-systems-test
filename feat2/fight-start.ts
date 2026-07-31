import { FeatSheet } from "."
import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet"
import { OwnerMaximal } from "../log2/types"
import { StatusSheet } from "../status-sheet/types"


export const getOnFightStartFeatHandlers = (owner: {
    fs: FeatSheet,
}) => {
    return Object.entries(owner.fs).filter(a => a[1].onFightStart)
}

export const applyOnFightStartFeatHandlers = (
    owner: OwnerMaximal,
    entries: ReturnType<typeof getOnFightStartFeatHandlers>
) => {
    for (let [k, v] of entries) {
        const result = v.onFightStart!(owner)
        if (result === undefined) continue
        const statuses = Array.isArray(result) ? result : [result]
        statuses.forEach((status, i) => {
            owner.ss[statuses.length > 1 ? `${key}${i}` : key] = status
        })
    }
}
