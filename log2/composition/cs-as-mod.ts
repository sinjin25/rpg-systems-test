import newModNode, { mapFunc } from "..";
import { CsScore, EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import moddedCsScore from "./modded-cs-score";

const BASE = 10
const halfToZero = (raw: number) => {
    const halfMod = (raw - BASE) / 2
    return raw < BASE ? Math.ceil(halfMod) : Math.floor(halfMod)
}

const displayName = (member: CsScore): EveryTree => `${member}-as-mod`

export default (member: CsScore) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    // sum all SOURCES in score space (via modded-cs-score), THEN convert the grand total
    // to a modifier once. rounding each source on its own would round-then-add and inflate.
    const score = moddedCsScore(member)(owner, opts)
    return newModNode(displayName(member), [score], mapFunc(halfToZero))
}
