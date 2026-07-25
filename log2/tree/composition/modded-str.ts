import newModNode, { sumFunc, mapFunc } from "../..";
import newRawStr from "../bases/raw-str";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import strFromStatus from "./status/str-from-status";

const displayName: EveryTree = 'modded-str'

// pathfinder halves round toward zero, not down: str 9 -> -0.5 -> +0, str 7 -> -1.5 -> -1.
const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

const moddedStr = (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        'raw-str': newRawStr(owner),
        'str-from-status': strFromStatus(owner),
    }

    const subpr = Object.values(subproblems)

    // sum all str SOURCES in score space, THEN convert the grand total to a modifier once.
    // rounding each source on its own would round-then-add and inflate the result.
    const totalStr = newModNode('total-str', subpr, sumFunc)

    return newModNode(
        displayName,
        [totalStr],
        mapFunc(halfToZero)
    )
}

export default moddedStr
