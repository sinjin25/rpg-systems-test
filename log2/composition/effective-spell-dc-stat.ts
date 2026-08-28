import newModNode, { maxFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import csAsMod from "./cs-as-mod";

const displayName: EveryTree = 'effective-spell-dc-stat'

const effectiveSpellStat = (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    return newModNode(displayName, [csAsMod('int')(owner, opts)], maxFunc)
}

export default effectiveSpellStat
