import newModNode, { leaf, sumFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import { equipmentIsWeapon } from "../../equipment-sheet";
import critMultiplierMod from "./crit-multiplier-mod";

const displayName: EveryTree = 'crit-multiplier'
const DEFAULT_MULTIPLIER = 1.5

export default (owner: OwnerLog2) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    const handler = relevantSlot.broadContexts[displayName]

    if (!handler) return newModNode(displayName, [
        leaf(relevantSlot.displayName, DEFAULT_MULTIPLIER),
        critMultiplierMod(owner),
    ], sumFunc)

    return newModNode(displayName, [
        leaf(relevantSlot.displayName, handler(owner)!.total()),
        critMultiplierMod(owner),
    ], sumFunc)
}