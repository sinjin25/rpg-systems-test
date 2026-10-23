import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2, TreeSubproblems } from "../types";
import critThreatRangeMod from "../composition/crit-threat-range-mod";
import finalSides from "../roll/final-sides";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

const displayName: EveryTree = 'crit-threat-range'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const relevantSlot = opts.relevantSlot ?? owner.es.mainhand
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    const weaponCritThreatHandler = relevantSlot.broadContexts['crit-threat-range']

    const subproblems: TreeSubproblems = {
        'crit-threat-range-mod': critThreatRangeMod(owner, opts),
        'crit-threat-range': weaponCritThreatHandler
            ? weaponCritThreatHandler(owner, opts)
            : finalSides(20, 'attack-sides-mod')(owner, opts),
        'crit-threat-range-equipment-mod': modFromEquipment('crit-threat-range-equipment-mod')(owner, opts)
    }

    const subpr = Object.values(subproblems)
        .filter(a => !!a)

    return newModNode(displayName, subpr, sumFunc)
}
