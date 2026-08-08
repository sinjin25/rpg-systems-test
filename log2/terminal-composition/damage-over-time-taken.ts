import newModNode, { ModNode, mapFunc, sumFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import damageTakenStatusMod from "../composition/status/damage-taken-status-mod";
import featContribution from "../composition/feat-contribution";

const displayName: EveryTree = 'damage-over-time-taken'

export default (incomingDamage: {
    node: ModNode,
    // any other information that might be required
}) => (owner: OwnerLog2) => {
    const incoming = newModNode('incoming-damage', [incomingDamage.node], sumFunc)

    return newModNode(
        displayName,
        [
            incoming,
            featContribution('damage-over-time-taken-feat-mod')(owner),
            damageTakenStatusMod(owner),
        ],
        mapFunc(v => Math.max(0, v)),
    )
}