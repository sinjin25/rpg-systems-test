import { FeatSheet } from "../../feat"
import type { CharacterSheet } from "../../character-sheet"
import { ClassLevelMember, ClassLevels, ClassLevelSheet } from "./type"

// prevent +1/-1 index access
const clampedLevel = (cl: ClassLevels): number => Math.min(cl.level, cl.data.length)

const acquiredMembers = (cl: ClassLevels): ClassLevelMember[] => cl.data.slice(0, clampedLevel(cl))

const sumNumericFromClassLevels = (
    sheet: ClassLevelSheet,
    pick: (member: ClassLevelMember) => number,
): number =>
    Object.values(sheet).reduce(
        (total, cl) => total + acquiredMembers(cl).reduce((sum, member) => sum + pick(member), 0),
        0,
    )

const sumAttackBonusFromClassLevels = (sheet: ClassLevelSheet): number =>
    sumNumericFromClassLevels(sheet, (member) => member.attackBonus)

const sumFortitudeSaveFromClassLevels = (sheet: ClassLevelSheet): number =>
    sumNumericFromClassLevels(sheet, (member) => member.fortitudeSave)

const sumReflexSaveFromClassLevels = (sheet: ClassLevelSheet): number =>
    sumNumericFromClassLevels(sheet, (member) => member.reflexSave)
// const sumWillSaveFromClassLevels = () => {}

// free feats ignore prereq requirements on purpose
const sumFeatsFromClassLevels = (sheet: ClassLevelSheet): FeatSheet =>
    Object.values(sheet).reduce<FeatSheet>((fs, cl) => {
        for (const member of acquiredMembers(cl)) Object.assign(fs, member.feats)
        return fs
    }, {})

// for determining health
const sumLevelsFromClassLevels = (sheet: ClassLevelSheet): number =>
    Object.values(sheet).reduce((total, cl) => total + clampedLevel(cl), 0)

// for consumption by other submodules (ex: health)
const getCharacterLevel = (cs: CharacterSheet): number => sumLevelsFromClassLevels(cs.levels)

const newClassLevelSheet = (): ClassLevelSheet => ({})

// return a new sheet so that other modules (level up) can mutate that without messing things up
const cloneClassLevelSheet = (sheet: ClassLevelSheet): ClassLevelSheet =>
    Object.fromEntries(Object.entries(sheet).map(([name, cl]) => [name, { ...cl }]))

// fake a class for passing tests that don't care about this
const characterLevels = (n: number): ClassLevelSheet => ({
    base: {
        displayName: 'Test Class',
        level: n,
        data: Array.from({ length: n }, (): ClassLevelMember => ({
            attackBonus: 0,
            fortitudeSave: 0,
            reflexSave: 0,
            feats: {},
        })),
    },
})

export {
    sumAttackBonusFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumReflexSaveFromClassLevels,
    sumFeatsFromClassLevels,
    sumLevelsFromClassLevels,
    getCharacterLevel,
    characterLevels,
    newClassLevelSheet,
    cloneClassLevelSheet,
}

/* future utilities */
// const determineCurrentHealthAfterLevelUp = () => {}
// const levelUp = () => {} // including select feat
