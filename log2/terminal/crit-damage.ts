import newModNode, { mapFunc, productFunc, sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2, TreeSubproblems } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";
import critMultiplier from "../composition/crit-multiplier";

const displayName: EveryTree = 'crit-damage'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const slot = opts.relevantSlot ?? owner.es.mainhand
    if (!slot) throw Error('relevant slot not passed')
    const subproblems: TreeSubproblems = {
        'crit-scalable-damage': critScalableDamage(owner, opts),
        'flat-damage': flatDamage(owner, opts),
        'crit-multiplier': critMultiplier(owner, opts),
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
