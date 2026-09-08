import newModNode, { maxFunc, ModNode } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import csAsMod from "./cs-as-mod";

const displayName: EveryTree = 'effective-damage-stat'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')
    const hasSlashingGrace = owner.fs['slashing grace']

    const candidates: ModNode[] = []

    if (isFinesse || hasSlashingGrace) candidates.push(...[csAsMod('str')(owner, opts), csAsMod('dex')(owner, opts)])
    else candidates.push(csAsMod('str')(owner, opts))

    return newModNode(displayName, candidates, maxFunc)
}
