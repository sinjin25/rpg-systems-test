import newModNode, { maxFunc, ModNode } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import moddedCsScore from "./modded-cs-score";

const displayName: EveryTree = 'effective-damage-stat'

export default (owner: OwnerMaximal) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.tags?.includes('finesse')
    const hasSlashingGrace = owner.fs['slashing grace']

    const candidates: ModNode[] = []

    if (isFinesse || hasSlashingGrace) candidates.push(...[moddedCsScore('str')(owner), moddedCsScore('dex')(owner)])
    else candidates.push(moddedCsScore('str')(owner))

    return newModNode(displayName, candidates, maxFunc)
}