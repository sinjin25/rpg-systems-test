import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import featContribution from "../composition/feat-contribution";
import csAsMod from "../composition/cs-as-mod";
import modFromEquipment from "../composition/equipment/mod-from-equipment";
import { stripSelectModNodeIfEmpty } from "../strip-if-empty";

const displayName: EveryTree = 'initiative'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const subproblems: TreeSubproblems = {
        'modded-dex': csAsMod('dex')(owner, opts),
        'initiative-feat-mod': featContribution('initiative-feat-mod')(owner, opts),
        'initiative-equipment-mod': modFromEquipment('initiative-equipment-mod')(owner, opts)
    }

    const subpr = stripSelectModNodeIfEmpty(Object.values(subproblems))

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
