import { CharacterSheet, defaultCharacterSheet } from "../character-sheet"
import { shortsword } from "../equipment-sheet2/defaults"
import { BaseEquipment, EquipmentSheet } from "../equipment-sheet2/types"
import { Tags } from "../log2/tags"
import { StatusSheet } from "../status-sheet2"
import { Health, instantiateHealth, instantiateSpeed, Speed } from "./instantiate"
import { FeatSheet } from "../feat2"
import { cloneClassLevelSheet } from "../character-sheet/class-level/derive"
import { AbilitySheet, createDefaultAbilitySheet } from "../ability-sheet2"

// remove dependency on Owner asap
export type OwnerMaximal = {
    cs: CharacterSheet,
    fs: FeatSheet,
    ss: StatusSheet,
    es: EquipmentSheet,
    relevantSlot?: BaseEquipment
    tags: Tags[], // starts empty, a terminal tree should mutate it. Use the utility functions from tags.ts
    // not checked:
    as: AbilitySheet,
}

export type Actor2 = {
    speed: Speed,
    health: Health,
    owner: OwnerMaximal,
}

export const instantiateActor = (owner: OwnerMaximal): Actor2 => {
    const { health, tree } = instantiateHealth(owner)
    const { speed, tree: tree2 } = instantiateSpeed(owner)

    return {
        health,
        speed,
        owner,
    }
}

export const createDefaultOwner = (data: Partial<{
    cs?: Partial<CharacterSheet>,
    fs?: OwnerMaximal['fs'],
    es?: Partial<EquipmentSheet>,
    ss?: StatusSheet,
    as?: Partial<AbilitySheet>,
}> = {}): OwnerMaximal => {
    const defaultWp = shortsword
    const fs = data.fs ?? {}
    const ss = data.ss ?? {}
    const owner: OwnerMaximal = {
        cs: {
            ...defaultCharacterSheet,
            ...data.cs,
            // fresh per owner - `levels` is mutable state (level-up writes to it),
            // so it must not alias the shared default sheet's record
            levels: cloneClassLevelSheet(data.cs?.levels ?? defaultCharacterSheet.levels),
        },
        es: {
            mainhand: defaultWp,
            ...data.es,
        },
        fs,
        tags: [],
        ss,
        as: {
            ...createDefaultAbilitySheet(),
            ...data.as,
        },
    }
    owner.relevantSlot = owner.es.mainhand
    return owner
}
