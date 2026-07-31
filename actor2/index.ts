import { AbilitySheet } from "../ability-sheet"
import { CharacterSheet } from "../character-sheet"
import { Owner } from "../character/actor"
import { shortsword } from "../equipment-sheet2/defaults"
import { BaseEquipment, EquipmentSheet } from "../equipment-sheet2/types"
import { Tags } from "../log2/tags"
import { ObjectWithBroadContexts } from "../log2/types"
import { StatusSheet } from "../status-sheet2"
import { createDefaultOwner as createLegacyOwner } from "../defaults"

// remove dependency on Owner asap
export type OwnerMaximal = Omit<Owner, 'fs' | 'ss' | 'es'> &
{
    fs: Record<string, ObjectWithBroadContexts>,
    ss: StatusSheet,
    es: EquipmentSheet,
    relevantSlot?: BaseEquipment
    tags: Tags[], // starts empty, a terminal tree should mutate it. Use the utility functions from tags.ts
}

export const createDefaultOwner = (data: Partial<{
    cs: Partial<CharacterSheet>,
    fs: OwnerMaximal['fs'],
    es: Partial<EquipmentSheet>,
    ss: Partial<StatusSheet>,
    as: Partial<AbilitySheet>,
}> = {}): OwnerMaximal => {
    const { fs, ...rest } = data
    // TODO: remove as soon as refactor is done
    // @ts-expect-error
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
