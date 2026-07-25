import newModNode, { sumFunc } from "..";
import { ContextNames } from "../../contexts";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import moddedCon from "../composition/modded-con";
import saveFeatMod from "../composition/save-feat-mod";
import saveStatusMod from "../composition/save-status-mod";
import saveEquipmentMod from "../composition/save-equipment-mod";

const displayName: EveryTree = 'fortitude'

const FORTITUDE_CONTEXT = ['constitution'] as ContextNames[]

export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-fortitude': baseSave(owner, 'fortitude'),
        'modded-con': moddedCon(owner),
        'save-feat-mod': saveFeatMod(owner),
        'save-status-mod': saveStatusMod(owner),
        'save-equipment-mod': saveEquipmentMod(owner, FORTITUDE_CONTEXT),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}