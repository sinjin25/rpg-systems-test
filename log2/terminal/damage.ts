import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";
import rollDamage from "../composition/roll-damage";
import { stripSelectModNodeIfEmpty } from "../strip-if-empty";

const displayName: EveryTree = 'damage'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const subproblems: TreeSubproblems = {
        'crit-scalable-damage': critScalableDamage(owner, opts),
        'flat-damage': flatDamage(owner, opts),
        // ex: 1d6 also base weapon implicit damage
        'roll-damage': rollDamage(owner, opts),
    }

    const subpr = stripSelectModNodeIfEmpty(Object.values(subproblems))

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
