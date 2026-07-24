import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { equipmentIsWeapon } from "../../../../equipment-sheet";
import damageOfEquipmentPiece from "../bases/damage-of-equipment-piece";
import effectiveDamageStat from "./effective-damage-stat";
import critScalableDamageFeatMod from "./crit-scalable-damage-feat-mod";

const displayName: EveryTree = 'crit-scalable-damage'

// The damage ELIGIBLE to be scaled by a crit multiplier (it is not multiplied here): the weapon's
// rolled damage, the effective attack stat, and any feat mods that opted into scaling. Authored once
// and consumed by two destinations - 'damage' sums it flat, 'crit-damage' multiplies it (see DESIGN.md
// "destinations choose the transformations"). Owns the relevantSlot weapon guard, so both inherit it.
const critScalableDamage = (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')
    if (!equipmentIsWeapon(relevantSlot)) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        damageOfEquipmentPiece(relevantSlot),
        effectiveDamageStat(owner),
        critScalableDamageFeatMod(owner),
    ], sumFunc)
}

export default critScalableDamage
