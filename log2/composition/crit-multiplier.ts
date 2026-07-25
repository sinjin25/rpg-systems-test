import newModNode, { leaf, sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import { equipmentIsWeapon } from "../../equipment-sheet";
import critMultiplierMod from "./crit-multiplier-mod";

const displayName: EveryTree = 'crit-multiplier'
const DEFAULT_MULTIPLIER = 1.5

export default (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')
    if (!equipmentIsWeapon(relevantSlot)) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        leaf('weapon base', relevantSlot.critMultiplier ?? DEFAULT_MULTIPLIER),
        critMultiplierMod(owner),
    ], sumFunc)
}