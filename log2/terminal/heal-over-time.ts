import newModNode, { ModNode, sumFunc } from "..";
import featContribution from "../composition/feat-contribution";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";

const displayName: EveryTree = 'heal-over-time'

export default (instance: ModNode) => (owner: OwnerLog2) => {
    const subproblems: TreeSubproblems = {
        // scale value here
        'heal-over-time-feat-mod': featContribution('heal-over-time-feat-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        [...subpr, instance],
        sumFunc,
    )
}
