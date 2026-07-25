import newModNode, { sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";

const displayName: EveryTree = 'damage'

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'crit-scalable-damage': critScalableDamage(owner),
        'flat-damage': flatDamage(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}