// add tags to something
// these are intended to be for equipment (trees have access to broadContext to apply on relevant tree mods)
// this is intended for subrequirements (ex: attack roll when you have a shield. Damage taken when you have heavy armor, etc.)

import { OwnerLog2 } from "./types"

// it is theoretically possible that we can pre-collect some tags based on outside circumstances (ex: "ac WHEN is attacked by ranged") but this is NOT THE CURRENT STATE OF IT
export type EquipmentTags = | 'melee'
    | 'ranged'
    | 'magic'
    | 'finesse'
    | 'shield'
    | 'one-handed'
    | 'dueling' // one-handed no shield
    | 'two-handed'
    | 'light-armor'
    | 'medium-armor'
    | 'heavy-armor'
    | 'unarmored'
    | 'ac'
// from terminal branches
export type TerminalTags = | 'standard-attack'
    | 'crit-confirm'
export type Tags = EquipmentTags | TerminalTags

export const addTags = (list: Tags[], toAdd: Tags | Tags[]) => {
    if (Array.isArray(toAdd)) return [...list, ...toAdd]
    return [...list, toAdd]
}

export const mutateOwnerTags = (owner: OwnerLog2, ...arbitraryTags: Tags[]) => {
    const tags = owner?.tags || []
    const eqTags = owner?.relevantSlot?.tags || []
    const tg = Array.from(new Set<Tags>([...tags, ...eqTags, ...arbitraryTags]))
    owner.tags = tg
    /* console.log('mutateOwnerTags', owner.tags, tg) */
}

export const hasAnyTag = (list: Tags[], whitelist: Tags[], blacklist: Tags[] = []) => {
    if (blacklist.some((tag) => list.includes(tag))) return false
    return whitelist.some((tag) => list.includes(tag))
}

export const hasAllTags = (list: Tags[], whitelist: Tags[]) =>
    whitelist.every((tag) => list.includes(tag))