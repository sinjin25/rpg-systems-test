import { Ability, getAbilityKey } from "../../ability-sheet"
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

// BAB from a single class: its per-level attack bonuses summed over the levels actually acquired.
// (sumAttackBonusFromClassLevels is this folded across every class on the sheet.)
const attackBonusForClass = (cl: ClassLevels): number =>
    acquiredMembers(cl).reduce((sum, member) => sum + member.attackBonus, 0)

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

// deduped by key so a multiclass that grants the same ability twice still only
// gets one copy in the rotation
const sumAbilitiesFromClassLevels = (sheet: ClassLevelSheet): Ability[] => {
    const byKey: Record<string, Ability> = {}
    for (const cl of Object.values(sheet)) {
        for (const member of acquiredMembers(cl)) {
            for (const ability of member.abilities ?? []) byKey[getAbilityKey(ability)] = ability
        }
    }
    return Object.values(byKey)
}

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
    attackBonusForClass,
    sumFortitudeSaveFromClassLevels,
    sumReflexSaveFromClassLevels,
    sumFeatsFromClassLevels,
    sumAbilitiesFromClassLevels,
    sumLevelsFromClassLevels,
    getCharacterLevel,
    characterLevels,
    newClassLevelSheet,
    cloneClassLevelSheet,
}

/* future utilities */
// const determineCurrentHealthAfterLevelUp = () => {}
// const levelUp = () => {} // including select feat
