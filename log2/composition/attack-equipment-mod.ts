import { EveryTree, OwnerMaximal } from "../types";
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod";
import { extractContextsTags } from "../../equipment-sheet/extract";
import { equipmentIsWeapon, Weapon } from "../../equipment-sheet";
import { modResultToNode } from "../collect-status-contributions";

const displayName: EveryTree = 'attack-equipment-mod'

export default (owner: OwnerMaximal) => {
    const mainhand = owner.es.mainhand
    const weapon = (mainhand && equipmentIsWeapon(mainhand) ? mainhand : undefined) as Weapon
    const tags = mainhand ? extractContextsTags(mainhand) : []
    return modResultToNode(displayName, calculateWeaponEquipmentMod(
        { cs: owner.cs, fs: {}, es: owner.es, weapon },
        tags,
        'attack',
    ))
}