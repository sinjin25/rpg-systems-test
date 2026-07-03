import { DEFAULT_STAT, calculateModifier } from "../stat-modifier"

export { DEFAULT_STAT, calculateModifier }

export interface CharacterSheet {
    str: number,
    dex: number,
    con: number,
}

export interface UseCharacterSheet {
    characterSheet: CharacterSheet,
    calculateModifier: (stat: number, bonuses?: number[]) => number,
}

export const defaultCharacterSheet: CharacterSheet = {
    con: 15,
    str: 15,
    dex: 15,
}

export const defaultUseCharacterSheet: UseCharacterSheet = {
    characterSheet: defaultCharacterSheet,
    calculateModifier,
}
