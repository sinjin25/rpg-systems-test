import { FeatSheet } from "../../feat"
import { ClassLevelMember, ClassLevels, ClassLevelSheet } from "./type"

// clamp the acquired level to the table length: a `level` past the end of the
// progression table can't grant more than the table defines, so we cap it rather
// than over-counting or reading off the end.
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

const newClassLevelSheet = (): ClassLevelSheet => ({})

export {
    sumAttackBonusFromClassLevels,
    sumFortitudeSaveFromClassLevels,
    sumReflexSaveFromClassLevels,
    sumFeatsFromClassLevels,
    sumLevelsFromClassLevels,
    newClassLevelSheet,
}

/* future utilities */
// const determineCurrentHealthAfterLevelUp = () => {}
// const levelUp = () => {} // including select feat
