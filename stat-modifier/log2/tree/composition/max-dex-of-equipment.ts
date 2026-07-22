// the lowest max-dex cap across worn armor

import newModNode, { minFunc } from "../..";
import { Armor, equipmentIsArmor } from "../../../../equipment-sheet";
import { OwnerMaximal, EveryTree } from "../types";
import maxDexOfEquipmentPiece from "../bases/max-dex-of-equipment-piece";
import { collectStatusContributions } from "../../collect-status-contributions";

const TEMP_MAX = 999
const displayName: EveryTree = 'max-dex-of-equipment'

const maxDexOfEquipment = (owner: OwnerMaximal) => {
    // guard: look for flat-footed first
    const collection = collectStatusContributions(owner, displayName)
    const flatFooted = collection.find(a => a.displayName === 'flat-footed')


    const items = Object.values(owner.es).filter((e): e is Armor => !!e && equipmentIsArmor(e))

    if (items.length === 0) return newModNode(displayName, [], () => TEMP_MAX)

    const pieces = items.map(a => maxDexOfEquipmentPiece(a))
        .filter(a => isFinite(a.total()))

    if (flatFooted) pieces.push(newModNode('flat-footed', [], () => 0))

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