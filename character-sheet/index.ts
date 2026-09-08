export * from './types'
import { ClassLevelPickLog } from "../class-level2/types"
import { CharacterSheet, defaultFlavorSheet } from './types'

export const fakeCharacterLevels = (n: number): ClassLevelPickLog => {
    const result: ClassLevelPickLog = []
    for (let i = 0; i < n; i++) {
        result.push({
            key: 'fighter',
            freeFeats: [],
        })
    }
    return result
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
    levels: fakeCharacterLevels(1),
    flavorSheet: {
        ...defaultFlavorSheet,
    }
}
