import { EveryTree, OwnerMaximal } from "../types";
import { calculateWeaponEquipmentMod } from "../../../../roll-modifier/equipment-mod";
import { extractContextsTags } from "../../../../equipment-sheet/extract";
import { equipmentIsWeapon, Weapon } from "../../../../equipment-sheet";
import { modResultToNode } from "../../collect-status-contributions";

const displayName: EveryTree = 'attack-equipment-mod'

// Equipment contribution to an attack: the weapon's own enhancement (+1 weapon) plus any worn gear
// that boosts attack (e.g. a finesse-attack ring). Same legacy bridge as attack-feat-mod. The faked
// weapon is the mainhand; calculateWeaponEquipmentMod drops every OTHER weapon in es and counts only
// this one, alongside the non-weapon gear. Each applying source becomes a child leaf.
//
// The `as Weapon` cast is safe: when the mainhand is missing or not a weapon we pass undefined, and
// calculateWeaponEquipmentMod guards it (`equip?.generateAdditionalContexts`) - the non-weapon gear
// still contributes.
const attackEquipmentMod = (owner: OwnerMaximal) => {
    const mainhand = owner.es.mainhand
    const weapon = (mainhand && equipmentIsWeapon(mainhand) ? mainhand : undefined) as Weapon
    const tags = mainhand ? extractContextsTags(mainhand) : []
    return modResultToNode(displayName, calculateWeaponEquipmentMod(
        { cs: owner.cs, fs: owner.fs, es: owner.es, weapon },
        tags,
        'attack',
    ))
}

export default attackEquipmentMod
