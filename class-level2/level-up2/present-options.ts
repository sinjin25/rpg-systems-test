import { createDefaultOwner, OwnerMaximal } from "../../actor2";
import { FeatSheet } from "../../feat2";
import addFeat from "../../feat2/add-feat";
import possibleFeatKeys, { PossibleFeatKey } from "../../feat2/feats";
import { classLevelCounts, registry } from "../derive";
import { ClassKeys, ClassLevel, ClassLevelPickLog, ClassLevelSumKeys } from "../types";
import { ClassLevelProposal } from "./types";

// a propsal is a sheet we can work off of (UI) before comitting
// not be confused with being able to see all the levels from all the classes ahead of time
export const presentOptions = (clpl: ClassLevelPickLog): ClassLevelProposal[] => {
    // by default, everything is good if you can take more levels
    // in the future: there may be prereqs for classes
    const allClasses: ClassKeys[] = ['fighter', 'rogue']

    const freq = classLevelCounts(clpl)
    const proposals: ClassLevelProposal[] = []

    for (let key of allClasses) {
        const cl = registry[key] as ClassLevel
        if (!cl) continue

        // does it have another level to get?
        const level = freq[key] ?? 0
        if (level >= cl.attackBonus.length) continue

        proposals.push({
            attackBonus: cl.attackBonus[level],
            fortitude: cl.attackBonus[level],
            reflex: cl.attackBonus[level],
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
        clp: ClassLevelProposal, freeFeat?: PossibleFeatKey
    }
) => {
    const { clp, freeFeat } = data
    const fakeOwner = createDefaultOwner()
    fakeOwner.cs = owner.cs // required for prereqs
    fakeOwner.fs = { ...owner.fs }
    try {
        if (clp.hasFreeFeats) {
            if (!freeFeat) return false
            const f = possibleFeatKeys[freeFeat]
            if (!f) throw Error(`!f for ${freeFeat}`)
            // this mutates
            const canAddFeat = addFeat(owner, f)
            if (!canAddFeat) throw Error('!canAddFeat')
        }

        for (let classFeatKey of clp.classFeats) {
            const f = possibleFeatKeys[classFeatKey]
            if (!f) throw Error(`!f for ${classFeatKey}`)
            owner.fs[classFeatKey] = f
        }

        owner.cs.levels.push({
            freeFeats: freeFeat ? [freeFeat] : [],
            key: clp.key,
        })
        return true
    }
    catch (e) {
        // restore fs and abort
        owner.fs = { ...fakeOwner.fs }
        return false
    }
}