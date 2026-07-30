import newModNode, { leaf, sumFunc } from "..";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import critThreatRangeMod from "../composition/crit-threat-range-mod";

const displayName: EveryTree = 'crit-threat-range'
const DEFAULT_THREAT_RANGE = 20
export default (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    const weaponCritThreatHandler = relevantSlot.broadContexts['crit-threat-range']

    const subproblems: TreeSubproblems = {
        'crit-threat-range-mod': critThreatRangeMod(owner),
        'crit-threat-range': weaponCritThreatHandler ? weaponCritThreatHandler(owner) : leaf(relevantSlot.displayName, DEFAULT_THREAT_RANGE)
    }

    const subpr = Object.values(subproblems)
        .filter(a => !!a)

    return newModNode(displayName, subpr, sumFunc)
}