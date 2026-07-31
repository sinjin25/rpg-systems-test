import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import { equipmentIsWeapon } from "../../equipment-sheet";
import damageOfEquipmentPiece from "../bases/damage-of-equipment-piece";
import effectiveDamageStat from "./effective-damage-stat";
import featContribution from "./feat-contribution";
import statusContribution from "./status/status-contribution";

const displayName: EveryTree = 'crit-scalable-damage'
export default (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        damageOfEquipmentPiece(relevantSlot)(owner),
        effectiveDamageStat(owner),
        featContribution('crit-scalable-damage-feat-mod')(owner),
        statusContribution('crit-scalable-damage-status-mod')(owner),
    ], sumFunc)
}