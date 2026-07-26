import { createDefaultOwner as createLegacyOwner } from "../defaults"
import { CharacterSheet } from "../character-sheet"
import { StatusSheet } from "../status-sheet"
import { AbilitySheet } from "../ability-sheet"
import { ObjectWithBroadContexts, OwnerMaximal } from "./types"

type BaseEquipment = {
    displayName: string,
    description?: string,
    /* contexts: Array<ContextNames | EquipmentContextNames>, */
    broadContext?: Record<string, ObjectWithBroadContexts>
}
export type EquipmentSlot = 'mainhand' | 'offhand' | 'twohanded' | 'armor' | 'ring' | 'amulet'
type EquipmentSheet = {
    [K in EquipmentSlot]?: BaseEquipment
}
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
