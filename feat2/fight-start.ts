import { FeatSheet } from "."
import { CharacterSheet } from "../character-sheet"
import { OwnerMaximal } from "../actor2"
import { newStatusInstance } from "../status-sheet2"


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
        /* console.log('looking at', k, v) */
        const result = v.onFightStart!(owner)
        if (result === undefined) continue
        const statuses = Array.isArray(result) ? result : [result]
        /* console.log('statuses', statuses) */
        statuses.forEach((status, i) => {
            /* console.log('key is', statuses.length > 1 ? `${k}${i}` : k) */
            const key = statuses.length > 1 ? `${k}${i}` : k
            owner.ss[key] = [newStatusInstance(status, owner)]
        })
    }
}
