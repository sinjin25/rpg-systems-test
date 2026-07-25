import newModNode, { sumFunc, mapFunc } from "../..";
import newRawCon from "../bases/raw-con";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import equipmentModdedCon from "./equipment/equipment-modded-con";
import conFromStatus from "./status/con-from-status";

const displayName: EveryTree = 'modded-con'

// pathfinder halves round toward zero, not down: con 9 -> -0.5 -> +0, con 7 -> -1.5 -> -1.
const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

const moddedCon = (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-con': newRawCon(owner),
        'con-from-status': conFromStatus(owner),
        'equipment-modded-con': equipmentModdedCon(owner),
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

export default moddedCon
