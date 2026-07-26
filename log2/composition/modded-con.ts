import newModNode, { sumFunc, mapFunc } from "..";
import rawCsScore from "../bases/raw-cs-score";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";
import csFromStatus from "./status/cs-from-status";

const displayName: EveryTree = 'modded-con'
const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

export default (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-con': rawCsScore('con')(owner),
        'con-from-status': csFromStatus('con')(owner),
        'con-from-equipment': modFromEquipment('con-from-equipment')(owner)
    }

    const subpr = Object.values(subproblems)

    // sum all con SOURCES in score space, THEN convert the grand total to a modifier once.
    // rounding each source on its own would round-then-add and inflate the result.
    const totalCon = newModNode('total-con', subpr, sumFunc)

    return newModNode(
        displayName,
        [totalCon],
        mapFunc(halfToZero)
    )
}
