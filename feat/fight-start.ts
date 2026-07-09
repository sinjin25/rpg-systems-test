import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet"
import { StatusSheet } from "../status-sheet/types"
import { FeatSheet } from "./types"

export type FightStartOwnerData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

// invoked once per actor at fight start (and again whenever a reused actor
// starts a fresh fight - see simulate/index.ts's worldState.playerAfterFight)
// this is for generating statuses ex: divine protection
export const applyFightStartFeats = (owner: FightStartOwnerData) => {
    for (const [key, feat] of Object.entries(owner.fs)) {
        if (!feat?.onFightStart) continue
        const result = feat.onFightStart(owner)
        if (!result) continue
        const statuses = Array.isArray(result) ? result : [result]
        statuses.forEach((status, i) => {
            owner.ss[statuses.length > 1 ? `${key}${i}` : key] = status
        })
    }
}

export default applyFightStartFeats
