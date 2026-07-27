import newModNode, { sumFunc } from "..";
import { ContextNames } from "../../contexts";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import saveStatusMod from "../composition/save-status-mod";
import saveEquipmentMod from "../composition/save-equipment-mod";
import featContribution from "../composition/feat-contribution";
import moddedCsScore from "../composition/modded-cs-score";

const displayName: EveryTree = 'fortitude'

const FORTITUDE_CONTEXT = ['constitution'] as ContextNames[]

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-fortitude': baseSave(owner, 'fortitude'),
        'modded-con': moddedCsScore('con')(owner),
        'fortitude-feat-mod': featContribution('fortitude-feat-mod')(owner),
        'fortitude-status-mod': saveStatusMod('fortitude')(owner),
        'fortitude-equipment-mod': saveEquipmentMod(owner, FORTITUDE_CONTEXT),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}