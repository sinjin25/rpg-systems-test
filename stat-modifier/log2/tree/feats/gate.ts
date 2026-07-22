import { ContextNames, EquipmentContextNames } from "../../../../contexts";
import { OwnerMaximal } from "../types";

// Tag gating for native feats, kept self-contained inside log2 (deliberately not importing the legacy
// standardFilters). A feat's producer reads these to decide whether it contributes, exactly like
// flat-footed reads the sheet to decide its own cap - the routing engine never sees a "condition".

type Tag = ContextNames | EquipmentContextNames

// tags on the weapon in hand (the mainhand stand-in the rest of the attack tree also uses)
export const weaponTags = (owner: OwnerMaximal): Tag[] => owner.es.mainhand?.contexts ?? []

// is any equipped piece tagged `tag` (e.g. a worn shield or heavy armor)
export const hasEquipmentTag = (owner: OwnerMaximal, tag: Tag): boolean =>
    Object.values(owner.es).some(e => !!e && (e.contexts ?? []).includes(tag))

// blacklist wins; then passes if any whitelist tag is present. An empty whitelist means unconditional.
// Mirrors the legacy noBlacklistAnyWhitelist filter without depending on it.
export const passesTags = (tags: Tag[], whitelist: Tag[], blacklist: Tag[]): boolean => {
    if (tags.some(t => blacklist.includes(t))) return false
    return whitelist.length === 0 ? true : tags.some(t => whitelist.includes(t))
}
