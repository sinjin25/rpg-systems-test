import newModNode, { sumFunc } from "..";
import { ContextNames } from "../../contexts";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import saveStatusMod from "../composition/save-status-mod";
import saveEquipmentMod from "../composition/save-equipment-mod";
import moddedCsScore from "../composition/modded-cs-score";
import featContribution from "../composition/feat-contribution";

const displayName: EveryTree = 'reflex'

const REFLEX_CONTEXT = ['dexterity'] as ContextNames[]
export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-reflex': baseSave(owner, 'reflex'),
        'modded-dex': moddedCsScore('dex')(owner),
        'reflex-feat-mod': featContribution('reflex-feat-mod')(owner),
        'reflex-status-mod': saveStatusMod('reflex')(owner),
        'reflex-equipment-mod': saveEquipmentMod(owner, REFLEX_CONTEXT),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}