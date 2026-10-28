import { createDefaultOwner, OwnerMaximal } from "../../actor2";
import { FeatIds } from "../../feat2/types";
import addFeat from "../../feat2/add-feat";
import featRegistry from "../../feat2/registry";
import { classLevelCounts, registry } from "../derive";
import { ClassKeys, ClassLevel, ClassLevelPickLog, ClassLevelTable } from "../types";

// a single level's row, resolved against what the character has already taken —
// not to be confused with being able to see all the levels from all the classes ahead of time
export const newClassLevelList = (clpl: ClassLevelPickLog): ClassLevel[] => {
    // by default, everything is good if you can take more levels
    // in the future: there may be prereqs for classes
    const allClasses: ClassKeys[] = ['fighter', 'rogue']

    const freq = classLevelCounts(clpl)
    const proposals: ClassLevel[] = []

    for (let key of allClasses) {
        const cl = registry[key] as ClassLevelTable
        if (!cl) continue

        // does it have another level to get?
        const level = freq[key] ?? 0
        if (level >= cl.attackBonus.length) continue

        proposals.push({
            attackBonus: cl.attackBonus[level],
            will: cl.will[level],
            fortitude: cl.fortitude[level],
            reflex: cl.reflex[level],
            classFeats: cl.classFeats[level],
            hasFreeFeats: cl.hasFreeFeats[level],
            key: cl.key
        })
    }

    return proposals
}

export const chooseOptionAndMutate = (
    owner: OwnerMaximal,
    data: {
        clp: ClassLevel, freeFeat?: FeatIds
    }
) => {
    const { clp, freeFeat } = data
    const fakeOwner = createDefaultOwner()
    fakeOwner.cs = owner.cs // required for prereqs
    fakeOwner.fs = { ...owner.fs }
    try {
        if (clp.hasFreeFeats.length > 0) {
            if (!freeFeat) return false
            const f = featRegistry[freeFeat]
            if (!f) throw Error(`!f for ${freeFeat}`)
            // this mutates
            const canAddFeat = addFeat(owner, f)
            if (!canAddFeat) throw Error('!canAddFeat')
        }

        for (let classFeatKey of clp.classFeats) {
            const f = featRegistry[classFeatKey]
            if (!f) throw Error(`!f for ${classFeatKey}`)
            owner.fs = { ...owner.fs, [classFeatKey]: f }
        }

        owner.cs = {
            ...owner.cs,
            levels: [...owner.cs.levels, {
                freeFeats: freeFeat ? [freeFeat] : [],
                key: clp.key,
            }],
        }
        return true
    }
    catch (e) {
        // restore fs and abort
        owner.fs = { ...fakeOwner.fs }
        return false
    }
}
