// the max dex from a piece of equipment

import newModNode from "../..";
import { Armor, equipmentIsArmor } from "../../../equipment-sheet";
import acOfEquipmentPiece from "../../bases/ac-of-equipment-piece";
import { OwnerLog2, EveryTree } from "../../types";

const displayName: EveryTree = 'ac-of-equipment'

export default (owner: OwnerLog2) => {
    const items = Object.values(owner.es).map(a => {
        return acOfEquipmentPiece(a)(owner)
    })
        .filter(a => !!a)

    return newModNode(
        displayName,
        [
            ...items,
        ]
    )
}