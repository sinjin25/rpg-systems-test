// the full (non-crit) damage: the crit-scalable bucket (weapon roll + effective stat + scaling-eligible
// mods) and the flat bucket (mods that never scale), simply summed. crit-damage consumes the SAME two
// sub-problems but multiplies the scalable bucket instead - see crit-damage.ts and DESIGN.md
// "destinations choose the transformations". The relevantSlot weapon guard lives in crit-scalable-damage,
// inherited here.

import newModNode, { sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import critScalableDamage from "../composition/crit-scalable-damage";
import flatDamage from "../composition/flat-damage";

const displayName: EveryTree = 'damage'

const damage = (owner: OwnerMaximal) => {
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

export default damage
