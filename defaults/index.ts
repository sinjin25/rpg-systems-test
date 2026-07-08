import { CharacterSheet, UseCharacterSheet, calculateModifier } from '../character-sheet'
import { FeatSheet } from '../feat'
import { EquipmentSheet } from '../equipment-sheet'
import { dagger, shortsword } from './equipment'

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
