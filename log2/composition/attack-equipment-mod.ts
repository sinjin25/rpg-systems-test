import { EveryTree, OwnerMaximal } from "../types";
import { calculateWeaponEquipmentMod } from "../../roll-modifier/equipment-mod";
import { extractContextsTags } from "../../equipment-sheet/extract";
import { equipmentIsWeapon, Weapon } from "../../equipment-sheet";
import modFromEquipment from "./equipment/mod-from-equipment";
import newModNode from "..";

const displayName: EveryTree = 'attack-from-equipment'

export default (owner: OwnerMaximal) => {
    /* const mainhand = owner.es.mainhand
    const weapon = (mainhand && equipmentIsWeapon(mainhand) ? mainhand : undefined) as Weapon
    const tags = mainhand ? extractContextsTags(mainhand) : []
    return modResultToNode(displayName, calculateWeaponEquipmentMod(
        { cs: owner.cs, fs: {}, es: owner.es, weapon },
        tags,
        'attack',
    )) */
    const mainhand = owner.es.mainhand
    if (!mainhand) throw Error('a weapon was required')

    return modFromEquipment(displayName)(owner)
}