import newModNode, { sumFunc, mapFunc } from "..";
import rawCsScore from "../bases/raw-cs-score";
import { CsScore, EveryTree, OwnerLog2, TreeSubproblems } from "../types";
import modFromEquipment from "./equipment/mod-from-equipment";
import csFromStatus from "./status/cs-from-status";

const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

const displayName = (member: CsScore): EveryTree => `modded-${member}`

export default (member: CsScore) => (owner: OwnerLog2) => {

    const subproblems: TreeSubproblems = {
        [`raw-${member}`]: rawCsScore(member)(owner),
        [`${member}-from-status`]: csFromStatus(member)(owner),
        [`${member}-from-equipment`]: modFromEquipment(`${member}-from-equipment`)(owner)
    }

    const subpr = Object.values(subproblems)

    // sum all SOURCES in score space, THEN convert the grand total to a modifier once.
    // rounding each source on its own would round-then-add and inflate the result.
    const total = newModNode(`${member}-total`, subpr, sumFunc)

    return newModNode(
        displayName(member),
        [total],
        mapFunc(halfToZero)
    )
}