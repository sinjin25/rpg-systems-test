import { OwnerMaximal } from "../../actor2";
import { FeatIds } from "../../feat2/types";
import addFeat from "../../feat2/add-feat";
import { deriveFeatKey, registry as featRegistry } from "../../feat2/registry";
import meetsPrereq from "../../feat2/meets-prereq";
import { classLevelCounts, getCurrentLevel, registry } from "../derive";
import { ClassKeys, ClassLevel, ClassLevelPickLog, ClassLevelTable, LevelUpProposal, MutationFailureReason, MutationFailureReasons, MutationResult } from "../types";
import { _verifyOwnerIsClone } from "./clone";

const _newClassLevelList = (clpl: ClassLevelPickLog): ClassLevel[] => {
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

export const newLevelUpProposal = (
    owner: OwnerMaximal,
): LevelUpProposal => {
    const currentLevel = getCurrentLevel(owner.cs.levels)
    const nextLevel = currentLevel + 1
    const levelHasFreeFeat = nextLevel % 2 === 1 // odd levels

    const classLevelList = _newClassLevelList(owner.cs.levels)

    return {
        classLevelList,
        freeFeatsFromLevel: [{
            levelHasFreeFeats: levelHasFreeFeat,
        }],
        nextLevel,
    }
}

// should provide a new clone every time if running multiple times
export const patchCloneWithProposal = (
    owner: {
        original: OwnerMaximal,
        clone: OwnerMaximal,
    },
    data: {
        cl: ClassLevel, // chosen one
        chosenFeats: FeatIds[],
    }
): OwnerMaximal | null => {
    // ASSUMPTION: original is in same state as clone at this point
    // IF this is violated, you have a callsite issue
    const isOkay = _verifyOwnerIsClone(owner)
    if (!isOkay) return null
    const { clone } = owner

    // get the set of FeatIds from ClassLevel.classFeats
    // get the ones from chosenFeats
    const classFeatsToAdd = [...data.cl.classFeats]
    for (let f of classFeatsToAdd) {
        const pointer = featRegistry[f]
        // bypass addFeat to avoid prereq
        if (pointer) clone.fs[deriveFeatKey(pointer)] = pointer
    }

    for (let f of data.chosenFeats) {
        const pointer = featRegistry[f]
        // bypass addFeat to avoid prereq
        // mutationResult 's job
        if (pointer) clone.fs[deriveFeatKey(pointer)] = pointer
    }

    // modify ClassLevelPickLog
    const newCs = structuredClone(clone.cs)
    newCs.levels.push({
        key: data.cl.key,
        freeFeats: [...data.chosenFeats]
    })
    clone.cs = newCs

    return clone
}

/* 
FLOW:
a newLevelupProposal is given to the display layer

the display layer makes a clone and mutates that freely

when done, the display layer hands back a result to the data layer (not sure what the shape is yet)

mutationResult verifies it and returns a yes or no

This is used inside rpg-content\map\controls\level-up.ts
*/
export const mutationResult = (
    owner: {
        original: OwnerMaximal,
        clone: OwnerMaximal,
    },
    data: {
        cl: ClassLevel, // chosen one
        chosenFeats: FeatIds[],
    }
): MutationResult => {
    const { original, clone } = owner
    const { cl, chosenFeats } = data

    const fail = (reason: MutationFailureReason): MutationResult => ({
        result: { kind: 'failure', reason },
        original,
        clone,
    })

    if (!_verifyOwnerIsClone({ original, clone })) return fail(MutationFailureReasons.improperClone)

    for (const id of chosenFeats) {
        if (!featRegistry[id]) return fail(MutationFailureReasons.featDoesNotExist)
    }

    const seen = new Set<FeatIds>(cl.classFeats)
    for (const id of chosenFeats) {
        if (seen.has(id)) return fail(MutationFailureReasons.duplicateFeat)
        seen.add(id)
    }

    for (const id of chosenFeats) {
        if (!meetsPrereq(clone, featRegistry[id])) return fail(MutationFailureReasons.prereqNotMet)
    }

    return {
        result: { kind: 'success' },
        original,
        clone,
    }
}
