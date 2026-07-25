import newModNode, { rollNode } from "../..";
import { Armor, Weapon } from "../../../equipment-sheet";
import { OwnerMaximal } from "../types";

export default (equipment: Weapon) => {
    // freeze the roll in the closure so it isn't recalced on running .total()
    const frozenRoll = equipment.damage()
    return newModNode(
        equipment.displayName,
        [],
        () => frozenRoll,
    )
}