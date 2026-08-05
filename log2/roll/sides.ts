// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, RollSidesMod } from "../types";
import acOfEquipment from "../composition/ac/ac-of-equipment";
import acFromDex from "../composition/ac/ac-from-dex";
import baseAc from "../bases/base-ac";
import acStatusMod from "../composition/status/ac-status-mod";
import featContribution from "../composition/feat-contribution";
import { mutateOwnerTags, Tags } from "../tags";
import { EquipmentSheet, EquipmentSlot } from "../../equipment-sheet2/types";

// this is for modifying sides
export default (member: RollSidesMod) => (owner: OwnerLog2): ModNode | undefined => {
    const displayName = member
    const subpr = [featContribution(displayName)(owner)]

    const hasChildren = subpr[0]!.children.length
    if (hasChildren === 0) return undefined

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}