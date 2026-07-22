// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import acOfEquipment from "../composition/ac-of-equipment";
import acFromDex from "../composition/ac-from-dex";
import baseAc from "../bases/base-ac";

const displayName: EveryTree = 'ac'

const ac = (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-ac': baseAc(owner),
        'ac-from-dex': acFromDex(owner),
        "ac-of-equipment": acOfEquipment(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default ac