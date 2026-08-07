import type { ClassLevelSheet } from "./class-level/type"
import { fakeCharacterLevels } from "./util"

export interface FlavorSheet {
    displayName: string,
    description: string,
}

export const defaultFlavorSheet: FlavorSheet = {
    description: 'Little is known about this creature.',
    displayName: 'Monster',
}

export interface CharacterSheet {
    str: number,
    dex: number,
    con: number,
    int: number,
    levels: ClassLevelSheet,
    flavorSheet?: FlavorSheet
}

export interface UseCharacterSheet {
    cs: CharacterSheet,
    calculateModifier: (stat: number, bonuses?: number[]) => number,
}

export const defaultCharacterSheet: CharacterSheet = {
    con: 15,
    str: 15,
    dex: 15,
    int: 15,
    levels: fakeCharacterLevels(1),
    flavorSheet: {
        displayName: 'Player',
        description: '',
    }
}

export const defaultEnemySheet: CharacterSheet = {
    con: 10,
    str: 10,
    dex: 10,
    int: 10,
    levels: {},
    flavorSheet: {
        ...defaultFlavorSheet,
    }
}