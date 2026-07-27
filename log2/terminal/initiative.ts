import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import featContribution from "../composition/feat-contribution";
import moddedCsScore from "../composition/modded-cs-score";

const displayName: EveryTree = 'initiative'

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'modded-dex': moddedCsScore('dex')(owner),
        'initiative-feat-mod': featContribution('initiative-feat-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}