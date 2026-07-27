import newModNode, { sumFunc } from "..";
import { ContextNames } from "../../contexts";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import saveStatusMod from "../composition/status/save-status-mod";
import moddedCsScore from "../composition/modded-cs-score";
import featContribution from "../composition/feat-contribution";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

const displayName: EveryTree = 'reflex'

const REFLEX_CONTEXT = ['dexterity'] as ContextNames[]
export default (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'base-reflex': baseSave(owner, 'reflex'),
        'modded-dex': moddedCsScore('dex')(owner),
        'reflex-feat-mod': featContribution('reflex-feat-mod')(owner),
        'reflex-status-mod': saveStatusMod('reflex')(owner),
        'reflex-equipment-mod': modFromEquipment('reflex-equipment-mod')(owner)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}