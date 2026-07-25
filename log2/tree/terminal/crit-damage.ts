import newModNode, { mapFunc, productFunc, sumFunc } from "../..";
import { EveryTree, OwnerMaximal, TreeSubproblems } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";
import critMultiplier from "../composition/crit-multiplier";

const displayName: EveryTree = 'crit-damage'

// The crit damage tree: floor( multiplier x (weaponRoll + scalableMods) + flatMods ). Reuses the same
// crit-scalable-damage / flat-damage sub-problems the non-crit 'damage' terminal sums; the only
// difference is that here the scalable bucket is multiplied by the crit multiplier while the flat
// bucket is added on afterward. Ports crit2/apply-multiplier: the multiplier is a visible child of the
// product, and the single Math.floor at the root reproduces legacy's floor of (scaledPortion + flatPortion).
const critDamage = (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'crit-scalable-damage': critScalableDamage(owner),
        'flat-damage': flatDamage(owner),
        'crit-multiplier': critMultiplier(owner),
    }

    // multiplier x scalable damage -> the actually-scaled portion. productFunc keeps the multiplier as
    // a child, so the outline shows what was multiplied by what; commutative, so child order is free.
    const scaledPortion = newModNode('crit-scaled-portion', [
        subproblems['crit-multiplier']!,
        subproblems['crit-scalable-damage']!,
    ], productFunc)

    return newModNode(displayName, [
        scaledPortion,
        subproblems['flat-damage']!,
    ], mapFunc(Math.floor, sumFunc))
}

export default critDamage
