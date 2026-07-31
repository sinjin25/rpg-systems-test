import newModNode, { sumFunc } from "..";
import { ContextNames } from "../../contexts";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import saveStatusMod from "../composition/status/save-status-mod";
import featContribution from "../composition/feat-contribution";
import moddedCsScore from "../composition/modded-cs-score";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

const displayName: EveryTree = 'fortitude'

const FORTITUDE_CONTEXT = ['constitution'] as ContextNames[]

export default (owner: OwnerLog2) => {
    const subproblems: TreeSubproblems = {
        'base-fortitude': baseSave(owner, 'fortitude'),
        'modded-con': moddedCsScore('con')(owner),
        'fortitude-feat-mod': featContribution('fortitude-feat-mod')(owner),
        'fortitude-status-mod': saveStatusMod('fortitude')(owner),
        'fortitude-equipment-mod': modFromEquipment('fortitude-equipment-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}