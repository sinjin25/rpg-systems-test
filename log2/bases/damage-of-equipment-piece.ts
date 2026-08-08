import newModNode, { leaf } from "..";
import { Armor, Weapon } from "../../equipment-sheet";
import { BaseEquipment } from "../../equipment-sheet2/types";
import roll from "../../roll";
import { OwnerLog2 } from "../types";

export default (equipment: BaseEquipment) => (owner: OwnerLog2) => {
    // freeze the roll in the closure so it isn't recalced on running .total()
    const DEFAULT = roll(2)
    const frozenRoll = equipment.broadContexts.damage ?
        equipment.broadContexts.damage(owner)!.total() : leaf(equipment.displayName, DEFAULT).total()

    return newModNode(
        equipment.displayName,
        [],
        () => frozenRoll,
    )
}