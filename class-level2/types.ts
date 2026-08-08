import { PossibleFeatKey } from "../feat2/feats"

export type ClassKeys = 'fighter' | 'rogue'

export type ClassLevelSumKeys = 'fortitude' | 'reflex' | 'attackBonus'

export type ClassLevel = {
    [K in ClassLevelSumKeys]: number[]
} & {
    key: ClassKeys,
    classFeats: PossibleFeatKey[][],
    hasFreeFeats: boolean[],
}

export type ClassLevelPickLog = {
    key: ClassKeys, // maybe fighter
    freeFeats: PossibleFeatKey[],
}[]
