import newModNode, { maxFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import csAsMod from "./cs-as-mod";

const displayName: EveryTree = 'effective-attack-stat'

const effectiveAttackStat = (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')

    const candidates = isFinesse
        ? [csAsMod('dex')(owner, opts), csAsMod('str')(owner, opts)]
        : [csAsMod('str')(owner, opts)]

    return newModNode(displayName, candidates, maxFunc)
}

export default effectiveAttackStat
