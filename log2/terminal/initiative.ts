import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import featContribution from "../composition/feat-contribution";
import csAsMod from "../composition/cs-as-mod";

const displayName: EveryTree = 'initiative'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const subproblems: TreeSubproblems = {
        'modded-dex': csAsMod('dex')(owner, opts),
        'initiative-feat-mod': featContribution('initiative-feat-mod')(owner, opts)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
