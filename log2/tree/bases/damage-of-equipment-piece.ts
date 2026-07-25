import newModNode, { rollNode } from "../..";
import { Armor, Weapon } from "../../../../equipment-sheet";
import { OwnerMaximal } from "../types";

const damageOfEquipmentPiece = (equipment: Weapon) => {
    // resolve the roll once, here - total() must report the same number to every
    // caller (see rollNode in log2/index.ts). we can't use rollNode itself yet
    // because the legacy Weapon.damage() isn't a `sides` subtree.
    const frozenRoll = equipment.damage()
    return newModNode(
        equipment.displayName,
        [],
        () => frozenRoll,
    )
}

export default damageOfEquipmentPiece
