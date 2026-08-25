import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import featContribution from "../composition/feat-contribution";
import csAsMod from "../composition/cs-as-mod";

const displayName: EveryTree = 'initiative'

export default (owner: OwnerLog2) => {
    const subproblems: TreeSubproblems = {
        'modded-dex': csAsMod('dex')(owner),
        'initiative-feat-mod': featContribution('initiative-feat-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}