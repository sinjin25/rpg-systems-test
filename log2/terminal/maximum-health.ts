// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc, leaf, productFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import csAsMod from "../composition/cs-as-mod";
import featContribution from "../composition/feat-contribution";
import flatHealth from "../composition/flat-health";
import healthPerLevel from "../composition/health-per-level";
import baseHealth from "../bases/base-health";

/* const BASE = 20
const PER_LEVEL = 10 */
const displayName: EveryTree = 'maximum-health'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const subproblems: TreeSubproblems = {
        'flat-health': flatHealth(owner, opts),
        'base-health': baseHealth(owner, opts),
        'health-from-levels': newModNode(
            'health-from-levels',
            [
                leaf('levels', owner.cs.levels.length),
                healthPerLevel(owner, opts),
            ],
            productFunc,
        )
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        sumFunc,
    )
}
