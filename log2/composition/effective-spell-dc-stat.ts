import newModNode, { maxFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import moddedCsScore from "./modded-cs-score";

const displayName: EveryTree = 'effective-spell-dc-stat'

const effectiveSpellStat = (owner: OwnerLog2) => {
    return newModNode(displayName, [moddedCsScore('int')(owner)], maxFunc)
}

export default effectiveSpellStat