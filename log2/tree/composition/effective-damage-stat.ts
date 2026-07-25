import newModNode, { maxFunc, ModNode } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import moddedStr from "./modded-str";
import moddedDex from "./modded-dex";

const displayName: EveryTree = 'effective-damage-stat'

const effectiveDamageStat = (owner: OwnerMaximal) => {
    const mainhand = owner.es.mainhand
    const isFinesse = !!mainhand?.contexts?.includes('finesse')
    // this isn't programmed its just there for reference
    // also we don't have the concept of two handing or one handing a one handed weapon
    const hasSlashingGrace = owner.fs['slashing grace']

    const candidates: ModNode[] = []

    if (isFinesse || hasSlashingGrace) candidates.push(...[moddedStr(owner), moddedDex(owner)])
    else candidates.push(moddedStr(owner))

    return newModNode(displayName, candidates, maxFunc)
}

export default effectiveDamageStat
