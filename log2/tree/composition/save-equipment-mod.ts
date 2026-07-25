import { EveryTree, OwnerMaximal } from "../types";
import { ContextNames } from "../../../../contexts";
import calculateEquipmentMod from "../../../../equipment-sheet/equipment-mod";
import { modResultToNode } from "../../collect-status-contributions";

const displayName: EveryTree = 'save-equipment-mod'

// Equipment contribution to a save. Saves aren't weapon-tied, so - like AC and legacy save/variants -
// the equipment mod spans ALL equipment (not just the mainhand weapon). Same legacy context-tag bridge
// as attack-equipment-mod: calculateEquipmentMod returns one entry per applying source, and
// modResultToNode turns each into a child leaf. The base `context` distinguishes the saves the way
// legacy did - ['constitution'] for fortitude, ['dexterity'] for reflex.
const saveEquipmentMod = (owner: OwnerMaximal, context: ContextNames[]) => {
    const allEquipment = Object.values(owner.es)
    // fs: {} and ss omitted on purpose - same as attack-equipment-mod, the equipment bridge only
    // forwards data to equipment mod fns and never reads the (now-native) feat/status sheets.
    return modResultToNode(displayName, calculateEquipmentMod(
        allEquipment,
        { cs: owner.cs, es: owner.es, fs: {} },
        context,
        'save',
    ))
}

export default saveEquipmentMod
