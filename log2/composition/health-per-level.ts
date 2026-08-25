// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc, leaf } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import csAsMod from "../composition/cs-as-mod";

const BASE_PER_LEVEL = 10
const displayName: EveryTree = 'health-per-level'
export default (owner: OwnerLog2) => {
    const subproblems: TreeSubproblems = {
        'modded-con': csAsMod('con')(owner),
        'base-health-per-level': leaf('base-health-per-level', BASE_PER_LEVEL)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        sumFunc,
    )
}