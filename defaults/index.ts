import { CharacterSheet, UseCharacterSheet, calculateModifier } from '../character-sheet'
import { FeatSheet } from '../feat'
import { EquipmentSheet } from '../equipment-sheet'
import { dagger, shortsword } from './equipment'
import { FeatModRequiredData } from '../feat/core-types'
import { defaultStatusSheet } from '../status-sheet'
import { createDefaultAbilitySheet } from '../ability-sheet'
import { Owner } from '../character/actor'

export const defaultCharacterSheet: CharacterSheet = {
    con: 15,
    str: 15,
    dex: 15,
    level: 1,
}

export const defaultUseCharacterSheet: UseCharacterSheet = {
    cs: defaultCharacterSheet,
    calculateModifier,
}

export const defaultFeatSheet: FeatSheet = {}

export const defaultEquipmentSheet: EquipmentSheet = {
    mainhand: shortsword,
}

export const createDefaultOwner = (data: Partial<Owner>) => {
    return {
        cs: {
            ...defaultCharacterSheet,
            ...data.cs
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