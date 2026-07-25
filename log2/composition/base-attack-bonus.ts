import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import baseAttackBonusForClassLevel from "../bases/base-attack-bonus-for-class-level";

const displayName: EveryTree = 'base-attack-bonus'
export default (owner: OwnerMaximal) => {
    const perClass = Object.values(owner.cs.levels).map(baseAttackBonusForClassLevel)
    return newModNode(displayName, perClass, sumFunc)
}