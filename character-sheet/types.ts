import { ClassLevelPickLog } from "../class-level2/types"

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
    levels: ClassLevelPickLog,
    flavorSheet?: FlavorSheet
}
