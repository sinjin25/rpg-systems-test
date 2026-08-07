import { AbilitySheet, createDefaultAbilitySheet } from '../ability-sheet2'
import { OwnerMaximal } from '../actor2'
import { CharacterSheet } from '../character-sheet'
import { cloneClassLevelSheet } from '../character-sheet/class-level/derive'
import { fakeCharacterLevels } from '../character-sheet/util'
import { shortsword } from '../equipment-sheet2/defaults'
import { EquipmentSheet } from '../equipment-sheet2/types'
import { FeatSheet } from '../feat2'
import { StatusSheet } from '../status-sheet2'

export const defaultCharacterSheet: CharacterSheet = {
    con: 15,
    str: 15,
    dex: 15,
    int: 15,
    levels: fakeCharacterLevels(1),
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
}>): OwnerMaximal => {
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
            ...data.ss,
        },
        // fresh per owner - AbilitySheet categories hold mutable state
        as: data.as || createDefaultAbilitySheet(),
    } as OwnerMaximal
}