// the max dex from a piece of equipment

import { default as newModNode, ModNode } from "../..";
import maxDexOfEquipment from "../max-dex-of-equipment";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../../types"
import moddedCsScore from "../modded-cs-score";

const displayName: EveryTree = 'ac-from-dex'

export default (owner: OwnerLog2) => {

    const subproblems: TreeSubproblems = {
        // solve modded dex
        'modded-dex': moddedCsScore('dex')(owner),
        'max-dex-of-equipment': maxDexOfEquipment(owner)
    }

    const subpr = Object.values(subproblems)
        .filter(a => !!a)

    return newModNode(
        displayName,
        subpr,
        () => Math.min(...subpr.map(a => a.total()))
    )
}