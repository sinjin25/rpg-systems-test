import { createDefaultOwner as createLegacyOwner } from "../defaults"
import { CharacterSheet } from "../character-sheet"
import { StatusSheet } from "../status-sheet"
import { AbilitySheet } from "../ability-sheet"
import { EquipmentSheet, ObjectWithBroadContexts, OwnerMaximal } from "./types"

export const createDefaultOwner = (data: Partial<{
    cs: Partial<CharacterSheet>,
    fs: OwnerMaximal['fs'],
    es: Partial<EquipmentSheet>,
    ss: Partial<StatusSheet>,
    as: Partial<AbilitySheet>,
}> = {}): OwnerMaximal => {
    const { fs, ...rest } = data
    const base = createLegacyOwner(rest)
    return { ...base, fs: fs ?? {} }
}
