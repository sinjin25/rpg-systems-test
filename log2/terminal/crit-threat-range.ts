import newModNode, { leaf, sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2, TreeSubproblems } from "../types";
import critThreatRangeMod from "../composition/crit-threat-range-mod";

const displayName: EveryTree = 'crit-threat-range'
const DEFAULT_THREAT_RANGE = 20
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    const weaponCritThreatHandler = relevantSlot.broadContexts['crit-threat-range']

    const subproblems: TreeSubproblems = {
        'crit-threat-range-mod': critThreatRangeMod(owner, opts),
        'crit-threat-range': weaponCritThreatHandler ? weaponCritThreatHandler(owner, opts) : leaf(relevantSlot.displayName, DEFAULT_THREAT_RANGE)
    }

    const subpr = Object.values(subproblems)
        .filter(a => !!a)

    return newModNode(displayName, subpr, sumFunc)
}
