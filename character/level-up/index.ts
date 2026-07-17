import { addFeat, FeatSheet } from '../../feat'
import { possibleFeats } from '../../feat/feats'
import { PossibleFeatKeys } from '../../feat/types'
import { instantiateClassLevels } from '../../character-sheet/class-level/registry'
import { ClassLevels } from '../../character-sheet/class-level/type'
import { Owner } from '../actor'

export type LevelUpPreview = {
    className: string,
    nextLevel: number,
    // for unknown class or no more levels for given class
    // consider: do I wanna keep this? It's very UI-level
    atMax: boolean,
    grantedFeats: FeatSheet,
    offersBonusFeat: boolean,
    eligibleFeats: PossibleFeatKeys[],
}

// What the UI sends back to commit. bonusFeat is required if the level offers one.
export type LevelUpSelection = {
    className: string,
    bonusFeat?: PossibleFeatKeys,
}

export type LevelUpResult =
    | { ok: true, className: string, newLevel: number, addedFeats: PossibleFeatKeys[] }
    | { ok: false, reason: LevelUpError }


// reference these by key (e.g. LevelUpError.unknownClass) instead of magic strings
export const LevelUpError = {
    unknownClass: 'unknown-class',
    atMax: 'at-max',
    bonusFeatRequired: 'bonus-feat-required',
    unexpectedBonusFeat: 'unexpected-bonus-feat',
    prereqUnmet: 'prereq-unmet',
} as const

export type LevelUpError = typeof LevelUpError[keyof typeof LevelUpError]

// resolve the class the player is leveling: an existing one on the sheet, or a
// fresh instance from the registry for a brand-new dip. undefined => unknown class.
const resolveClass = (owner: Owner, className: string): ClassLevels | undefined =>
    owner.cs.levels[className] ?? instantiateClassLevels(className)

// the index of the next member to acquire. clamped so a level past the table end
// reports the end (mirrors clampedLevel in class-level).
const nextIndex = (cl: ClassLevels): number => Math.min(cl.level, cl.data.length)

const emptyPreview = (className: string, nextLevel: number): LevelUpPreview => ({
    className,
    nextLevel,
    atMax: true,
    grantedFeats: {},
    offersBonusFeat: false,
    eligibleFeats: [],
})

// BEFORE: describe what the next level in `className` grants, and which feats are
// currently legal bonus picks. Never mutates the owner.
export const previewLevelUp = (owner: Owner, className: string): LevelUpPreview => {
    const cl = resolveClass(owner, className)
    if (!cl) return emptyPreview(className, 0)

    const target = nextIndex(cl)
    if (target >= cl.data.length) return emptyPreview(className, target)

    const member = cl.data[target]

    // suggestions are checked against a sheet that already includes this level's
    // free grants, so a granted feat can satisfy a bonus pick's prerequisite
    const temp: FeatSheet = { ...owner.fs, ...member.feats }

    // feats you can add
    // consider showing feats even if you can't add
    const eligibleFeats = (Object.keys(possibleFeats) as PossibleFeatKeys[]).filter((key) => {
        if (temp[key]) return false // already owned (including this level's grants)
        const prereq = possibleFeats[key].prerequisites
        if (!prereq) return true
        return prereq({ cs: owner.cs, fs: temp })
    })

    return {
        className,
        nextLevel: target + 1,
        atMax: false,
        grantedFeats: { ...member.feats },
        offersBonusFeat: !!member.selectBonusFeat,
        eligibleFeats,
    }
}

// This functions mutates
// it also does security (ex: prereqs) before comitting
export const commitLevelUp = (owner: Owner, selection: LevelUpSelection): LevelUpResult => {
    const { className, bonusFeat } = selection

    const cl = resolveClass(owner, className)
    if (!cl) return { ok: false, reason: LevelUpError.unknownClass }

    const target = nextIndex(cl)
    if (target >= cl.data.length) return { ok: false, reason: LevelUpError.atMax }

    const member = cl.data[target]
    if (member.selectBonusFeat && !bonusFeat) return { ok: false, reason: LevelUpError.bonusFeatRequired }
    if (!member.selectBonusFeat && bonusFeat) return { ok: false, reason: LevelUpError.unexpectedBonusFeat }

    // temp copy that can be mutated
    // class feats are added first so they can satisfy feat prereqs
    const grantedKeys = Object.keys(member.feats) as PossibleFeatKeys[]
    const temp: FeatSheet = { ...owner.fs }
    for (const key of grantedKeys) {
        addFeat({ cs: owner.cs, fs: temp }, { key })
    }
    if (bonusFeat) {
        const met = addFeat({ cs: owner.cs, fs: temp }, { key: bonusFeat })
        if (!met) return { ok: false, reason: LevelUpError.prereqUnmet }
    }

    // commit changes
    // merge feats, increase class level, register new class if necessary
    Object.assign(owner.fs, temp)
    cl.level = target + 1
    owner.cs.levels[className] = cl

    return {
        ok: true,
        className,
        newLevel: cl.level,
        addedFeats: bonusFeat ? [...grantedKeys, bonusFeat] : grantedKeys,
    }
}
