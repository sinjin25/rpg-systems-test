// the lowest max-dex cap across worn armor

import newModNode, { leaf, minFunc } from "..";
import { OwnerLog2, EveryTree } from "../types";
import maxDexOfEquipmentPiece from "../bases/max-dex-of-equipment-piece";

const displayName: EveryTree = 'max-dex-of-equipment'

export default (owner: OwnerLog2) => {
    // guard: look for flat-footed first
    const flatFooted = owner.ss.flatFooted

    const items = Object.values(owner.es)
    const pieces = items.map(a => maxDexOfEquipmentPiece(a)(owner))
        .filter(a => !!a)

    if (flatFooted) pieces.push(leaf('flat-footed', 0))

    if (pieces.length === 0) return undefined

    return newModNode(
        displayName,
        pieces,
        () => {
            return minFunc(pieces)
        },
    )
}