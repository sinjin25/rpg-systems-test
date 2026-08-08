import { AbilitySheet, createDefaultAbilitySheet } from '../ability-sheet2'
export { createDefaultOwner, OwnerMaximal } from '../actor2'
import { CharacterSheet } from '../character-sheet'
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