import { EveryTree, OwnerLog2 } from "../types";
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod";
import { extractContextsTags } from "../../equipment-sheet/extract";
import { equipmentIsWeapon, Weapon } from "../../equipment-sheet";
import modFromEquipment from "./equipment/mod-from-equipment";
import newModNode from "..";

const displayName: EveryTree = 'attack-from-equipment'

export default (owner: OwnerLog2) => {
    const mainhand = owner.es.mainhand
    if (!mainhand) throw Error('a weapon was required')

    return modFromEquipment(displayName)(owner)
}