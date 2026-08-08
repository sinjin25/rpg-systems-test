import newModNode, { maxFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import moddedCsScore from "./modded-cs-score";

const displayName: EveryTree = 'effective-attack-stat'

const effectiveAttackStat = (owner: OwnerLog2) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')

    const candidates = isFinesse
        ? [moddedCsScore('dex')(owner), moddedCsScore('str')(owner)]
        : [moddedCsScore('str')(owner)]

    return newModNode(displayName, candidates, maxFunc)
}

export default effectiveAttackStat
