import { ContextNames, EquipmentContextNames } from "../../contexts";
import { OwnerMaximal } from "../../actor2";
// remove later probably

type Tag = ContextNames | EquipmentContextNames

// tags on the weapon in hand
export const weaponTags = (owner: OwnerMaximal): Tag[] => owner.es.mainhand?.contexts ?? []

export const hasEquipmentTag = (owner: OwnerMaximal, tag: Tag): boolean =>
    Object.values(owner.es).some(e => !!e && (e.contexts ?? []).includes(tag))

// blacklist wins over whitelist
export const passesTags = (tags: Tag[], whitelist: Tag[], blacklist: Tag[]): boolean => {
    if (tags.some(t => blacklist.includes(t))) return false
    return whitelist.length === 0 ? true : tags.some(t => whitelist.includes(t))
}
