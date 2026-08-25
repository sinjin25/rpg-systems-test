import newModNode, { maxFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import csAsMod from "./cs-as-mod";

const displayName: EveryTree = 'effective-attack-stat'

const effectiveAttackStat = (owner: OwnerLog2) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')

    const candidates = isFinesse
        ? [csAsMod('dex')(owner), csAsMod('str')(owner)]
        : [csAsMod('str')(owner)]

    return newModNode(displayName, candidates, maxFunc)
}

export default effectiveAttackStat
