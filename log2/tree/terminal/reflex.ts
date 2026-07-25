import newModNode, { sumFunc } from "../..";
import { ContextNames } from "../../../contexts";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import moddedDex from "../composition/modded-dex";
import saveFeatMod from "../composition/save-feat-mod";
import saveStatusMod from "../composition/save-status-mod";
import saveEquipmentMod from "../composition/save-equipment-mod";

const displayName: EveryTree = 'reflex'

const REFLEX_CONTEXT = ['dexterity'] as ContextNames[]
export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-reflex': baseSave(owner, 'reflex'),
        'modded-dex': moddedDex(owner),
        'save-feat-mod': saveFeatMod(owner),
        'save-status-mod': saveStatusMod(owner),
        'save-equipment-mod': saveEquipmentMod(owner, REFLEX_CONTEXT),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}