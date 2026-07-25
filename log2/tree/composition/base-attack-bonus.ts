import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import baseAttackBonusForClassLevel from "../bases/base-attack-bonus-for-class-level";

const displayName: EveryTree = 'base-attack-bonus'

// BAB across all of a character's classes: one child per class (e.g. Fighter 4, Slayer 2), summed.
// A class with no levels acquired contributes 0; an empty sheet -> no children -> 0 (sumFunc is safe
// on empty children).
const baseAttackBonus = (owner: OwnerMaximal) => {
    const perClass = Object.values(owner.cs.levels).map(baseAttackBonusForClassLevel)
    return newModNode(displayName, perClass, sumFunc)
}

export default baseAttackBonus
