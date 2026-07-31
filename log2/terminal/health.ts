// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import moddedCon from "../composition/modded-con";
import featContribution from "../composition/feat-contribution";

const displayName: EveryTree = 'health'
export default (owner: OwnerLog2) => {
    const subproblems: TreeSubproblems = {
        'modded-con': moddedCon(owner),
        'health': featContribution('health-feat-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}