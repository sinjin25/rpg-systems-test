// the lowest max-dex cap across worn armor

import newModNode, { minFunc } from "../..";
import { Armor, equipmentIsArmor } from "../../../../equipment-sheet";
import { OwnerMaximal, EveryTree } from "../types";
import maxDexOfEquipmentPiece from "../bases/max-dex-of-equipment-piece";

const TEMP_MAX = 999
const displayName: EveryTree = 'max-dex-of-equipment'

const maxDexOfEquipment = (owner: OwnerMaximal) => {
    const items = Object.values(owner.es).filter((e): e is Armor => !!e && equipmentIsArmor(e))

    if (items.length === 0) return newModNode(displayName, [], () => TEMP_MAX)

    const pieces = items.map(a => maxDexOfEquipmentPiece(a))
        .filter(a => isFinite(a.total()))

    return newModNode(
        displayName,
        pieces,
        () => {
            if (pieces.length === 0) return TEMP_MAX
            return minFunc(pieces)
        },
    )
}

export default maxDexOfEquipment