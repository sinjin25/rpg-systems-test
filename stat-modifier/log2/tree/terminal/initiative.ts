// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import moddedDex from "../composition/modded-dex";
import initiativeFeatMod from "../composition/initiative-feat-mod";

const displayName: EveryTree = 'initiative'

const initiative = (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'modded-dex': moddedDex(owner),
        'initiative-feat-mod': initiativeFeatMod(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default initiative