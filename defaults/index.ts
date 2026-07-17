import { CharacterSheet, UseCharacterSheet, calculateModifier } from '../character-sheet'
import { characterLevels, cloneClassLevelSheet } from '../character-sheet/class-level'
import { FeatSheet } from '../feat'
import { EquipmentSheet } from '../equipment-sheet'
import { dagger, shortsword } from './equipment'
import { FeatModRequiredData } from '../feat/core-types'
import { defaultStatusSheet, StatusSheet } from '../status-sheet'
import { AbilitySheet, createDefaultAbilitySheet } from '../ability-sheet'
import { Owner } from '../character/actor'

export const defaultCharacterSheet: CharacterSheet = {
    con: 15,
    str: 15,
    dex: 15,
    levels: characterLevels(1),
}

export const defaultUseCharacterSheet: UseCharacterSheet = {
    cs: defaultCharacterSheet,
    calculateModifier,
}

export const defaultFeatSheet: FeatSheet = {}

export const defaultEquipmentSheet: EquipmentSheet = {
    mainhand: shortsword,
}

export const createDefaultOwner = (data: Partial<{
    cs: Partial<CharacterSheet>,
    fs: Partial<FeatSheet>,
    es: Partial<EquipmentSheet>,
    ss: Partial<StatusSheet>,
    as: Partial<AbilitySheet>
}>): Owner => {
    return {
        cs: {
            ...defaultCharacterSheet,
            ...data.cs,
            // fresh per owner - `levels` is mutable state (level-up writes to it),
            // so it must not alias the shared default sheet's record
            levels: cloneClassLevelSheet(data.cs?.levels ?? defaultCharacterSheet.levels),
        },
        es: {
            ...defaultEquipmentSheet,
            ...data.es
        },
        fs: {
            ...defaultFeatSheet,
            ...data.fs,
        },
        ss: {
            ...defaultStatusSheet,
            ...data.ss,
        },
        // fresh per owner - AbilitySheet categories hold mutable state
        as: data.as || createDefaultAbilitySheet(),
    } as Owner
}