import { Experience } from "../experience/types"
import { FeatIds } from "../feat2/types"
import newModNode, { leaf, ModNode, sumFunc } from "../log2"
import fighter from "./fighter"
import rogue from "./rogue"
import { ClassKeys, ClassLevelPickLog, ClassLevelSumKeys, ClassLevelTable } from "./types"

export const registry: Record<ClassKeys, ClassLevelTable> = {
    fighter,
    rogue,
}

// how many levels of each class the log records
export const classLevelCounts = (clpl: ClassLevelPickLog): Partial<Record<ClassKeys, number>> => {
    const freq: Partial<Record<ClassKeys, number>> = {}
    for (const entry of clpl) {
        freq[entry.key] = (freq[entry.key] ?? 0) + 1
    }
    return freq
}

export const getCurrentLevel = (clpl: ClassLevelPickLog): number => {
    let currLevel = 0
    const counts = classLevelCounts(clpl)
    for (let freq of Object.values(counts)) {
        currLevel += freq
    }
    return currLevel
}

// total of one numeric column across the whole log, as a ModNode: one leaf per
// class, each holding that class's table summed down to however many levels of
// it were taken. The parent sums the leaves.
export const deriveBonus = (
    clpl: ClassLevelPickLog,
    key: ClassLevelSumKeys,
    displayName: string = key,
): ModNode => {
    const freq = classLevelCounts(clpl)

    const children: ModNode[] = []
    for (const clKey in freq) {
        const cl = registry[clKey as ClassKeys]
        if (!cl) throw Error(`Could not find class for class key ${clKey}`)

        const column = cl[key]
        if (!column) throw Error(`improper key for deriveBonus ${key}`)

        const levels = freq[clKey as ClassKeys]!
        // a log deeper than the table would silently under-sum otherwise
        if (levels > column.length) {
            throw Error(`log has ${levels} levels of ${clKey}, but its table only defines ${column.length}`)
        }

        const sum = column.slice(0, levels).reduce((acc, curr) => {
            return acc + curr
        }, 0)
        children.push(leaf(clKey, sum))
    }

    return newModNode(displayName, children, sumFunc)
}

// PROBABLY THROW THIS AWAY FUCK IT
// every feat the character has, class grants and free picks alike, in the order
// they were acquired. deduped, since a multiclass can be granted the same feat twice.
export const featsFromLog = (clpl: ClassLevelPickLog): FeatIds[] => {
    const seen: Partial<Record<FeatIds, true>> = {}
    const out: FeatIds[] = []
    const taken: Partial<Record<ClassKeys, number>> = {}

    for (const entry of clpl) {
        const cl = registry[entry.key]
        if (!cl) throw Error(`Could not find class for class key ${entry.key}`)

        // this entry is that class's `index`-th level
        const index = taken[entry.key] ?? 0
        taken[entry.key] = index + 1

        for (const feat of [...(cl.classFeats[index] ?? []), ...entry.freeFeats]) {
            if (seen[feat]) continue
            seen[feat] = true
            out.push(feat)
        }
    }

    return out
}

// if somehow you were able to get free levels or something
// this assumption would break
export const getNumberOfLevelupsAvailable = (
    ownerExperience: Experience,
    clpl: ClassLevelPickLog
) => {
    let currLevel = getCurrentLevel(clpl)

    const { breakpoints, currentXp } = ownerExperience
    let maxLevel = 0
    for (let i = 0; i < breakpoints.length; i++) {
        if (currentXp < breakpoints[i]) break
        maxLevel++
    }

    // at 0 xp you are level 1, therefore 1 off moment
    return Math.max(0, maxLevel - (currLevel - 1))
}