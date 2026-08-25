import newModNode, { maxFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import csAsMod from "./cs-as-mod";

const displayName: EveryTree = 'effective-spell-dc-stat'

const effectiveSpellStat = (owner: OwnerLog2) => {
    return newModNode(displayName, [csAsMod('int')(owner)], maxFunc)
}

export default effectiveSpellStat