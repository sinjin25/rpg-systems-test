import newModNode, { leaf, sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { equipmentIsWeapon } from "../../../../equipment-sheet";
import critThreatRangeMod from "../composition/crit-threat-range-mod";

const displayName: EveryTree = 'crit-threat-range'

// mirrors legacy crit2/range's DEFAULT_THREAT_RANGE: a weapon with no explicit critRange threatens
// only on a natural 20.
const DEFAULT_THREAT_RANGE = 20

// The crit threat range as a summed tree: the weapon's base critRange (e.g. a keen rapier's 18) plus
// any feat mods. This tree yields the *threshold* natural roll that threatens - lower total = wider
// range, so Improved Critical contributes -1 (see crit-threat-range-mod). A roll threatens when
// naturalRoll >= this total; that boolean (legacy crit2/threat's isThreat) is a decision kept outside
// the numeric tree. Ports legacy crit2/range: base + feat mod, summed.
const critThreatRange = (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')
    if (!equipmentIsWeapon(relevantSlot)) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        leaf('weapon base', relevantSlot.critRange ?? DEFAULT_THREAT_RANGE),
        critThreatRangeMod(owner),
    ], sumFunc)
}

export default critThreatRange
