// The full reflex save modifier (before the roll): the class base save + the dexterity modifier + the
// feat/status/equipment contributions, all summed. Mirrors terminal/fortitude.ts. Reflex reuses the
// raw modded-dex - NO max-dex armor cap (that cap is an AC concern only; see DESIGN.md "Attack and
// Reflex use the raw Dex modifier").

import newModNode, { sumFunc } from "../..";
import { ContextNames } from "../../../../contexts";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import baseSave from "../composition/base-save";
import moddedDex from "../composition/modded-dex";
import saveFeatMod from "../composition/save-feat-mod";
import saveStatusMod from "../composition/save-status-mod";
import saveEquipmentMod from "../composition/save-equipment-mod";

const displayName: EveryTree = 'reflex'

const REFLEX_CONTEXT = ['dexterity'] as ContextNames[]

const reflex = (owner: OwnerMaximal) => {
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

export default reflex
