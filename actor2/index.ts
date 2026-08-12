import { CharacterSheet, defaultCharacterSheet } from "../character-sheet"
import { shortsword } from "../equipment-sheet2/defaults"
import { BaseEquipment, EquipmentSheet } from "../equipment-sheet2/types"
import { Tags } from "../log2/tags"
import { StatusSheet } from "../status-sheet2"
import { Health, instantiateHealth, instantiateSpeed, Speed } from "./instantiate"
import { FeatSheet } from "../feat2"
import { AbilitySheet, createDefaultAbilitySheet } from "../ability-sheet2"
import { ClassLevelPickLog } from "../class-level2/types"

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

export const generatePlayerId = (() => {
    const RESERVED_PLAYER_ID = 1
    return () => RESERVED_PLAYER_ID
})()
export const generateNonPlayerId = (() => {
    // prevent a collision with the only reserved id
    let id = generatePlayerId() + 1

    return () => {
        const idToReturn = id
        id++
        return idToReturn
    }
})()

export type Actor2 = {
    id: number,
    speed: Speed,
    health: Health,
    owner: OwnerMaximal,
}

export const instantiateActor = (owner: OwnerMaximal, isPlayer = false): Actor2 => {
    const { health, tree } = instantiateHealth(owner)
    const { speed, tree: tree2 } = instantiateSpeed(owner)

    return {
        id: isPlayer ? generatePlayerId() : generateNonPlayerId(),
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
    const cloneLevels = (d: ClassLevelPickLog): ClassLevelPickLog => {
        // clone
        return d.map(a => ({
            ...a,
        }))
    }
    const owner: OwnerMaximal = {
        cs: {
            ...defaultCharacterSheet,
            ...data.cs,
            levels: cloneLevels(data?.cs?.levels || [{
                key: 'fighter',
                freeFeats: [],
            }]),
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
