import { OwnerMaximal } from "../actor2"
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

export type LevelUpProposal = {
    // the next level for each class given a character
    classLevelList: ClassLevel[],
    nextLevel: number,
    freeFeatsFromLevel: ClassLevelFreeFeats[],
}

export type MutationOutcomeResultSuccess = {
    kind: 'success'
}

export const MutationFailureReasons = {
    prereqNotMet: 'feat requirement not met',
    improperClone: 'improper clone provided',
    featDoesNotExist: 'feat does not exist',
    duplicateFeat: 'duplicate feat chosen',
} as const

export type MutationFailureReason = typeof MutationFailureReasons[keyof typeof MutationFailureReasons]

export type MutationOutcomeResultFailure = {
    kind: 'failure'
    reason: MutationFailureReason,
}

export type MutationResult = {
    result: MutationOutcomeResultFailure | MutationOutcomeResultSuccess,
    original: OwnerMaximal,
    clone: OwnerMaximal,
}