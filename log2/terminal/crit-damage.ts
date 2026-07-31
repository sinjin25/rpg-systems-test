import newModNode, { mapFunc, productFunc, sumFunc } from "..";
import { EveryTree, OwnerLog2, TreeSubproblems } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";
import critMultiplier from "../composition/crit-multiplier";

const displayName: EveryTree = 'crit-damage'

export default (owner: OwnerLog2) => {
    if (!owner.relevantSlot) throw Error('relevant slot not passed')
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