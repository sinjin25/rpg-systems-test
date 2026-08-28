import newModNode, { ModNode, mapFunc, sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import featContribution from "../composition/feat-contribution";

const displayName: EveryTree = 'heal-over-time-taken'

export default (incomingHeal: {
    node: ModNode,
    // any other information that might be required
}) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const incoming = newModNode('incoming-heal', [incomingHeal.node], sumFunc)

    return newModNode(
        displayName,
        [
            incoming,
            featContribution('heal-over-time-taken-feat-mod')(owner, opts),
        ],
        mapFunc(v => Math.max(0, v)),
    )
}
