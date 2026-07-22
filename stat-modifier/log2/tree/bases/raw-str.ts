import newModNode from "../..";
import { OwnerMaximal } from "../types";

const BASE = 10
const halfToZero = (raw: number) => {
    const mod = raw - BASE
    const halfMod = mod / 2
    if (mod < 0) return Math.ceil(halfMod)
    return Math.floor(halfMod)
}

const newRawStr = (owner: OwnerMaximal) => newModNode(
    'Raw Str',
    [],
    () => halfToZero(owner.cs.str)
)

export default newRawStr
