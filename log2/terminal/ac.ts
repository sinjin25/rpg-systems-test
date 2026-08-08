// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import acOfEquipment from "../composition/ac/ac-of-equipment";
import acFromDex from "../composition/ac/ac-from-dex";
import baseAc from "../bases/base-ac";
import acStatusMod from "../composition/status/ac-status-mod";
import featContribution from "../composition/feat-contribution";
import { mutateOwnerTags, Tags } from "../tags";
import { EquipmentSheet, EquipmentSlot } from "../../equipment-sheet2/types";

const displayName: EveryTree = 'ac'

export default (owner: OwnerLog2) => {
    const TERMINAL_TAGS: Tags[] = ['ac']

    if (!owner) throw Error('relevant slot was not passed')

    const eqTg = Object.values(owner.es).flatMap(a => a.tags ?? [])

    mutateOwnerTags(owner, ...eqTg, ...TERMINAL_TAGS)

    const subproblems: TreeSubproblems = {
        'base-ac': baseAc(owner),
        'ac-from-dex': acFromDex(owner),
        "ac-of-equipment": acOfEquipment(owner),
        'ac-feat-mod': featContribution('ac-feat-mod')(owner),
        'ac-status-mod': acStatusMod(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}