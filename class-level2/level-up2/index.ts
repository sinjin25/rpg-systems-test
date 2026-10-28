import { createDefaultOwner, OwnerMaximal } from "../../actor2";
import { FeatIds } from "../../feat2/types";
import addFeat from "../../feat2/add-feat";
import featRegistry from "../../feat2/registry";
import meetsPrereq from "../../feat2/meets-prereq";
import { classLevelCounts, getCurrentLevel, registry } from "../derive";
import { ClassKeys, ClassLevel, ClassLevelPickLog, ClassLevelTable, LevelUpProposal, MutationOutcomeResultFailure, MutationResult } from "../types";
import { _verifyOwnerIsClone } from "./clone";

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

export const newLevelUpProposal = (
    owner: OwnerMaximal,
): LevelUpProposal => {
    const currentLevel = getCurrentLevel(owner.cs.levels)
    const nextLevel = currentLevel + 1
    const levelHasFreeFeat = nextLevel % 2 === 1 // odd levels

    const classLevelList = newClassLevelList(owner.cs.levels)

    return {
        classLevelList,
        freeFeatsFromLevel: [{
            levelHasFreeFeats: levelHasFreeFeat,
        }],
        nextLevel,
    }
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

    const fail = (reason: MutationOutcomeResultFailure['reason']): MutationResult => ({
        result: { kind: 'failure', reason },
        original,
        clone,
    })

    if (!_verifyOwnerIsClone({ original, clone })) return fail('improper clone provided')

    for (const id of chosenFeats) {
        if (!featRegistry[id]) return fail('feat does not exist')
    }

    const seen = new Set<FeatIds>(cl.classFeats)
    for (const id of chosenFeats) {
        if (seen.has(id)) return fail('duplicate feat chosen')
        seen.add(id)
    }

    for (const id of chosenFeats) {
        if (!meetsPrereq(clone, featRegistry[id])) return fail('feat requirement not met')
    }

    return {
        result: { kind: 'success' },
        original,
        clone,
    }
}
