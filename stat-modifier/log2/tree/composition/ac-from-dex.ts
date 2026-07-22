// the max dex from a piece of equipment

import { default as newModNode, ModNode } from "../..";
import maxDexOfEquipment from "./max-dex-of-equipment";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types"
import moddedDex from "./modded-dex";

const displayName: EveryTree = 'ac-from-dex'

const acFromDex = (owner: OwnerMaximal) => {

    const subproblems: TreeSubproblems = {
        // solve modded dex
        'modded-dex': moddedDex(owner),
        'max-dex-of-equipment': maxDexOfEquipment(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => Math.min(...subpr.map(a => a.total()))
    )
}

export default acFromDex