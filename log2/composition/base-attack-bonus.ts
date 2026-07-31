import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import baseAttackBonusForClassLevel from "../bases/base-attack-bonus-for-class-level";

const displayName: EveryTree = 'base-attack-bonus'
export default (owner: OwnerLog2) => {
    const perClass = Object.values(owner.cs.levels).map(baseAttackBonusForClassLevel)
    return newModNode(displayName, perClass, sumFunc)
}