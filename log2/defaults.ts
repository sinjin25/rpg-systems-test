import { createDefaultOwner as createLegacyOwner } from "../defaults"
import { CharacterSheet } from "../character-sheet"
import { StatusSheet } from "../status-sheet"
import { AbilitySheet } from "../ability-sheet"
import { BaseEquipment, EquipmentSheet, ObjectWithBroadContexts, OwnerMaximal } from "./types"

const shortsword: BaseEquipment = {
    broadContexts: {},
    displayName: 'shortsword',
    tags: ['melee']
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
    const defaultWp = shortsword
    const owner: OwnerMaximal = {
        ...base, es: {
            mainhand: shortsword,
            ...data.es,
        }, fs: fs ?? {}, tags: []
    }
    console.log('owner.es', owner.es)
    owner.relevantSlot = owner.es.mainhand
    return owner
}
