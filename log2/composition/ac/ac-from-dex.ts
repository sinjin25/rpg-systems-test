// the max dex from a piece of equipment

import { default as newModNode, ModNode } from "../..";
import maxDexOfEquipment from "../max-dex-of-equipment";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../../types"
import csAsMod from "../cs-as-mod";

const displayName: EveryTree = 'ac-from-dex'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {

    const subproblems: TreeSubproblems = {
        // solve modded dex
        'modded-dex': csAsMod('dex')(owner, opts),
        'max-dex-of-equipment': maxDexOfEquipment(owner, opts)
    }

    const subpr = Object.values(subproblems)
        .filter(a => !!a)

    return newModNode(
        displayName,
        subpr,
        () => Math.min(...subpr.map(a => a.total()))
    )
}
