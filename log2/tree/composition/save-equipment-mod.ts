import { EveryTree, OwnerMaximal } from "../types";
import { ContextNames } from "../../../contexts";
import calculateEquipmentMod from "../../../equipment-sheet/equipment-mod";
import { modResultToNode } from "../../collect-status-contributions";

const displayName: EveryTree = 'save-equipment-mod'

export default (owner: OwnerMaximal, context: ContextNames[]) => {
    const allEquipment = Object.values(owner.es)
    return modResultToNode(displayName, calculateEquipmentMod(
        allEquipment,
        { cs: owner.cs, es: owner.es, fs: {} },
        context,
        'save',
    ))
}
