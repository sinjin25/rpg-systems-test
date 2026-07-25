// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import moddedCon from "../composition/modded-con";
import healthFeatMod from "../composition/health-feat-mod";

const displayName: EveryTree = 'health'
export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'modded-con': moddedCon(owner),
        'health': healthFeatMod(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}