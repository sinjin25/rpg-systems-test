// the max dex from a piece of equipment

import newModNode from "../..";
import acOfEquipmentPiece from "../../bases/ac-of-equipment-piece";
import { OwnerLog2, EveryTree, ModNodeOpts } from "../../types";

const displayName: EveryTree = 'ac-of-equipment'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const items = Object.values(owner.es).map(a => {
        return acOfEquipmentPiece(a)(owner, opts)
    })
        .filter(a => !!a)

    return newModNode(
        displayName,
        [
            ...items,
        ]
    )
}
