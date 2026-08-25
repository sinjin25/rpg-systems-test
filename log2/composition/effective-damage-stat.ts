import newModNode, { maxFunc, ModNode } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import csAsMod from "./cs-as-mod";

const displayName: EveryTree = 'effective-damage-stat'

export default (owner: OwnerLog2) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')
    const hasSlashingGrace = owner.fs['slashing grace']

    const candidates: ModNode[] = []

    if (isFinesse || hasSlashingGrace) candidates.push(...[csAsMod('str')(owner), csAsMod('dex')(owner)])
    else candidates.push(csAsMod('str')(owner))

    return newModNode(displayName, candidates, maxFunc)
}