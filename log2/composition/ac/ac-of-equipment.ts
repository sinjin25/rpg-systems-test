// the max dex from a piece of equipment

import newModNode from "../..";
import acOfEquipmentPiece from "../../bases/ac-of-equipment-piece";
import shieldProficiencyGate from "../../bases/shield-proficiency-gate";
import { OwnerLog2, EveryTree, ModNodeOpts } from "../../types";

const displayName: EveryTree = 'ac-of-equipment'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const items = Object.values(owner.es).map(a => {
        // this shit is fucky because normally we just collect tags as we go
        // but for this particular thing, that's damaging because suddenly everything has a heavy shield tag which means no AC w/o bonus
        // hence the weird pattern here
        // this is a selective ignore
        if (!shieldProficiencyGate(a)(owner)) return undefined
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
