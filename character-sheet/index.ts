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

export const DEFAULT_STAT = 10
export const calculateModifier: UseCharacterSheet['calculateModifier'] = (stat: number, bonuses: number[] = []) => {
    const baseline = stat - DEFAULT_STAT
    const mod = (bonuses || []).reduce((acc, curr) => acc + curr, 0)

    const final = baseline + mod
    if (final >= 0) return Math.floor(final / 2)
    return Math.ceil(final / 2)
}

export const defaultUseCharacterSheet: UseCharacterSheet = {
    characterSheet: defaultCharacterSheet,
    calculateModifier,
}