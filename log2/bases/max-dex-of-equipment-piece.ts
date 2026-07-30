import newModNode, { leaf } from "..";
import { Armor } from "../../equipment-sheet";
import { BaseEquipment } from "../../equipment-sheet2/types";
import { EveryTree, OwnerMaximal } from "../types";

const broadContext: EveryTree = 'max-dex-of-equipment'
export default (equipment: BaseEquipment) => (owner: OwnerMaximal) => {
    const handler = equipment.broadContexts[broadContext]
    if (!handler) return undefined
    return handler(owner)
}