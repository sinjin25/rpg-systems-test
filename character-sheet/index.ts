import { DEFAULT_STAT, calculateModifier } from "../stat-modifier"

export { DEFAULT_STAT, calculateModifier }

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
    level: number,
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
    level: 1,
    flavorSheet: {
        displayName: 'Player',
        description: '',
    }
}

export const defaultEnemySheet: CharacterSheet = {
    con: 10,
    str: 10,
    dex: 10,
    level: 1,
    flavorSheet: {
        ...defaultFlavorSheet,
    }
}

export const defaultUseCharacterSheet: UseCharacterSheet = {
    cs: defaultCharacterSheet,
    calculateModifier,
}