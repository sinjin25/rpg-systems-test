// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import acOfEquipment from "../composition/ac/ac-of-equipment";
import acFromDex from "../composition/ac/ac-from-dex";
import baseAc from "../bases/base-ac";
import acFeatMod from "../composition/ac/ac-feat-mod";
import acStatusMod from "../composition/status/ac-status-mod";

const displayName: EveryTree = 'ac'

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-ac': baseAc(owner),
        'ac-from-dex': acFromDex(owner),
        "ac-of-equipment": acOfEquipment(owner),
        'ac-feat-mod': acFeatMod(owner),
        'ac-status-mod': acStatusMod(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}