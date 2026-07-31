import { createDefaultOwner as createLegacyOwner } from "../defaults"
import { CharacterSheet } from "../character-sheet"
import { StatusSheet } from "../status-sheet"
import { AbilitySheet } from "../ability-sheet"
import { ObjectWithBroadContexts, OwnerMaximal } from "./types"
import { EquipmentSheet, BaseEquipment } from "../equipment-sheet2/types"

const shortsword: BaseEquipment = {
    broadContexts: {},
    displayName: 'shortsword',
    tags: ['melee']
}

// still contains some improper types until full xxxx2/ system is in place
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
            mainhand: defaultWp,
            ...data.es,
        }, fs: fs ?? {}, tags: []
    }
    /* console.log('owner.es', owner.es) */
    owner.relevantSlot = owner.es.mainhand
    return owner
}
