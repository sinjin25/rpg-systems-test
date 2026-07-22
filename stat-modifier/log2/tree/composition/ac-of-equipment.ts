// the max dex from a piece of equipment

import newModNode from "../..";
import { Armor, equipmentIsArmor } from "../../../../equipment-sheet";
import acOfEquipmentPiece from "../bases/ac-of-equipment-piece";
import { OwnerMaximal, EveryTree } from "../types";

const displayName: EveryTree = 'ac-of-equipment'

const acOfEquipment = (owner: OwnerMaximal) => {
    const items = Object.values(owner.es).filter((e): e is Armor => !!e && equipmentIsArmor(e))

    // this should actually be 10
    if (items.length === 0) return newModNode(displayName, [], () => 0)

    const entries = items.map(a => acOfEquipmentPiece(a))

    return newModNode(
        displayName,
        [
            // base ac 10
            ...entries,
        ]
    )
}

export default acOfEquipment