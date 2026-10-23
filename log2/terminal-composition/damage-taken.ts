import newModNode, { ModNode, mapFunc, sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import damageTakenStatusMod from "../composition/status/damage-taken-status-mod";
import featContribution from "../composition/feat-contribution";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

const displayName: EveryTree = 'damage-taken'

export default (incomingDamage: {
    node: ModNode,
    // any other information that might be required
}) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const incoming = newModNode('incoming-damage', [incomingDamage.node], sumFunc)

    return newModNode(
        displayName,
        [
            incoming,
            featContribution('damage-taken-feat-mod')(owner, opts),
            damageTakenStatusMod(owner, opts),
            modFromEquipment('damage-taken-equipment-mod')(owner, opts), // dr — already negative
        ],
        mapFunc(v => Math.max(0, v)),
    )
}
