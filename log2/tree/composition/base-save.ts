import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import baseSaveForClassLevel from "../bases/base-save-for-class-level";

// which save this base is for. Fortitude and reflex read different per-level fields off the class
// sheet but fold identically, so one parameterized node serves both (mirrors legacy save/variants).
export type SaveType = 'fortitude' | 'reflex'

const displayName: Record<SaveType, EveryTree> = {
    fortitude: 'base-fortitude',
    reflex: 'base-reflex',
}

// Base save across all of a character's classes: one child per class (e.g. Fighter 4, Slayer 2), summed.
// The direct analog of base-attack-bonus - a class with no levels acquired contributes 0; an empty sheet
// -> no children -> 0 (sumFunc is safe on empty children).
const baseSave = (owner: OwnerMaximal, saveType: SaveType) => {
    const perClass = Object.values(owner.cs.levels).map(cl => baseSaveForClassLevel(cl, saveType))
    return newModNode(displayName[saveType], perClass, sumFunc)
}

export default baseSave
