import newModNode, { leaf, sumFunc } from "..";
import { BaseEquipment } from "../../equipment-sheet2/types";
import roll from "../../roll";
import { OwnerLog2 } from "../types";

export default (equipment: BaseEquipment) => (owner: OwnerLog2) => {
    if (equipment.broadContexts.damage) {
        return equipment.broadContexts.damage(owner)!
    }
    // unarmed damage
    return newModNode(equipment.displayName, [leaf('1d2', roll(2))], sumFunc)
}