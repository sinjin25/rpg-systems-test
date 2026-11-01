import { CharacterSheet, defaultCharacterSheet } from "../character-sheet"
import { longsword, shortsword, testshortsword } from "../equipment-sheet2/defaults"
import { BaseEquipment, EquipmentSheet } from "../equipment-sheet2/types"
import { instantiateHealth, instantiateSpeed } from "./instantiate"
import { StatusSheet } from "../status-sheet2"
import { ModNodeOpts } from "../log2/types"
import { AbilitySheet } from "../ability-sheet2/types"
import { createDefaultAbilitySheet } from "../ability-sheet2"
import { ClassLevelPickLog } from "../class-level2/types"
import { Experience } from "../experience/types"
import { leaf } from "../log2"
import { createDefaultExperience, experienceBreakpoints } from "../experience"
import { Actor2, OwnerMaximal } from "./types"

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

export const instantiateActor = (owner: OwnerMaximal, isPlayer = false, opts: ModNodeOpts = {}): Actor2 => {
    const { health, tree } = instantiateHealth(owner)
    const { speed, tree: tree2 } = instantiateSpeed(owner, opts)

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
    experience?: Partial<Experience>,
}> = {}): OwnerMaximal => {
    const defaultWp = testshortsword
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
        experience: {
            ...createDefaultExperience(),
            ...data.experience,
        }
    }
    return owner
}
