import { FeatIds } from "../feat2/types"

export type ClassKeys = 'fighter' | 'rogue'

export type ClassLevelSumKeys = 'fortitude' | 'reflex' | 'attackBonus' | 'will'

export type ClassLevel = {
    [K in ClassLevelSumKeys]: number[]
} & {
    key: ClassKeys,
    classFeats: FeatIds[][],
    hasFreeFeats: boolean[],
}

export type ClassLevelPickLog = {
    key: ClassKeys, // maybe fighter
    freeFeats: FeatIds[],
}[]
