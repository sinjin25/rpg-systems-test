import { Feat2, FeatIds } from "../feat2/types"

export type ClassKeys = 'fighter' | 'rogue'

export type ClassLevelSumKeys = 'fortitude' | 'reflex' | 'attackBonus' | 'will'

export type ClassLevelFreeFeats = {
    levelHasFreeFeats: boolean,
    // ex: a subset of specific feats for a class
    // if missing, default to feat2/registry.ts
    registry?: Record<FeatIds, Feat2>
}

// one level's row out of a ClassLevelTable — whatever is a per-level array
// there becomes a single entry here, everything else carries through as-is
/* export type ClassLevel = {
    [K in keyof ClassLevelTable]: ClassLevelTable[K] extends (infer U)[] ? U : ClassLevelTable[K]
} */

export type ClassLevel = {
    key: ClassKeys,
    // always ignores prereqs
    classFeats: FeatIds[],
    // ex: one level offers any free feat as well as a feat from a subset (multiple) or it offers 0, etc.
    hasFreeFeats: ClassLevelFreeFeats[],
} & {
    [K in ClassLevelSumKeys]: number
}

export type ClassLevelTable = {
    key: ClassKeys,
    classFeats: FeatIds[][],
    hasFreeFeats: ClassLevelFreeFeats[][],
} & {
    [K in ClassLevelSumKeys]: number[]
}


export type ClassLevelPickLog = {
    key: ClassKeys, // ex: 'fighter'
    freeFeats: FeatIds[],
}[]
