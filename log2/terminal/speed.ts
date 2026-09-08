import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import featContribution from "../composition/feat-contribution";
import csAsMod from "../composition/cs-as-mod";
import statusContribution from "../composition/status/status-contribution";

const displayName: EveryTree = 'speed'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const subproblems: TreeSubproblems = {
        'speed-feat-mod': featContribution('speed-feat-mod')(owner, opts),
        'speed-status-mod': statusContribution('speed-status-mod')(owner, opts)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
