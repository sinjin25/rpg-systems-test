import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import moddedDex from "../composition/modded-dex";
import featContribution from "../composition/feat-contribution";

const displayName: EveryTree = 'initiative'

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'modded-dex': moddedDex(owner),
        'initiative-feat-mod': featContribution('initiative-feat-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}