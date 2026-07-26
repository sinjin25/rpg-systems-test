import newModNode, { sumFunc, mapFunc } from "..";
import rawCsScore from "../bases/raw-cs-score";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";
import csFromStatus from "./status/cs-from-status";

const displayName: EveryTree = 'modded-dex'
const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

export default (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-dex': rawCsScore('dex')(owner),
        'dex-from-status': csFromStatus('dex')(owner),
        'dex-from-equipment': modFromEquipment('dex-from-equipment')(owner)
    }

    const subpr = Object.values(subproblems)

    // sum all dex SOURCES in score space, THEN convert the grand total to a modifier once.
    // rounding each source on its own would round-then-add and inflate the result.
    const totalDex = newModNode('total-dex', subpr, sumFunc)

    return newModNode(
        displayName,
        [totalDex],
        mapFunc(halfToZero)
    )
}