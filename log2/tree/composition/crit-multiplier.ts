import newModNode, { leaf, sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { equipmentIsWeapon } from "../../../../equipment-sheet";
import critMultiplierMod from "./crit-multiplier-mod";

const displayName: EveryTree = 'crit-multiplier'

// mirrors legacy crit2/multiplier's DEFAULT_MULTIPLIER: a weapon with no explicit critMultiplier
// crits for x1.5
const DEFAULT_MULTIPLIER = 1.5

// The crit multiplier as a summed tree: the weapon's base multiplier plus any feat increments (a
// feat bumping a x2 weapon to x3 adds +1). Kept as its own node so crit-damage can hang it off the
// product as a visible child (see the productFunc comment in index.ts) rather than a hidden constant.
const critMultiplier = (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')
    if (!equipmentIsWeapon(relevantSlot)) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        leaf('weapon base', relevantSlot.critMultiplier ?? DEFAULT_MULTIPLIER),
        critMultiplierMod(owner),
    ], sumFunc)
}

export default critMultiplier
