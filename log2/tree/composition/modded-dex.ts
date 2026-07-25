import newModNode, { sumFunc, mapFunc } from "../..";
import newRawDex from "../bases/raw-dex";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import equipmentModdedDex from "./equipment/equipment-modded-dex";
import dexFromStatus from "./status/dex-from-status";

const displayName: EveryTree = 'modded-dex'

// pathfinder halves round toward zero, not down: dex 9 -> -0.5 -> +0, dex 7 -> -1.5 -> -1.
const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

const moddedDex = (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-dex': newRawDex(owner),
        'dex-from-status': dexFromStatus(owner),
        'equipment-modded-dex': equipmentModdedDex(owner),
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

export default moddedDex