import newModNode, { leaf } from "..";
import { Armor, Weapon } from "../../equipment-sheet";
import roll from "../../roll";
import { BaseEquipment, OwnerMaximal } from "../types";

export default (equipment: BaseEquipment) => (owner: OwnerMaximal) => {
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