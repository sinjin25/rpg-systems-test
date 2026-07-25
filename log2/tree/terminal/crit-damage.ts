import newModNode, { mapFunc, productFunc, sumFunc } from "../..";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";
import critMultiplier from "../composition/crit-multiplier";

const displayName: EveryTree = 'crit-damage'

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'crit-scalable-damage': critScalableDamage(owner),
        'flat-damage': flatDamage(owner),
        'crit-multiplier': critMultiplier(owner),
    }
    const scaledPortion = newModNode('crit-scaled-portion', [
        subproblems['crit-multiplier']!,
        subproblems['crit-scalable-damage']!,
    ], productFunc)

    return newModNode(displayName, [
        scaledPortion,
        subproblems['flat-damage']!,
    ], mapFunc(Math.floor, sumFunc))
}