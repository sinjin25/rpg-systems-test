import newModNode, { leaf, sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { equipmentIsWeapon } from "../../../equipment-sheet";
import critThreatRangeMod from "../composition/crit-threat-range-mod";

const displayName: EveryTree = 'crit-threat-range'
const DEFAULT_THREAT_RANGE = 20
export default (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')
    if (!equipmentIsWeapon(relevantSlot)) throw Error('Need to pass in a weapon to relevantSlot')

    return newModNode(displayName, [
        leaf('weapon base', relevantSlot.critRange ?? DEFAULT_THREAT_RANGE),
        critThreatRangeMod(owner),
    ], sumFunc)
}