// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, ModNodeOpts } from "../types";
import acOfEquipment from "../composition/ac/ac-of-equipment";
import acFromDex from "../composition/ac/ac-from-dex";
import baseAc from "../bases/base-ac";
import acStatusMod from "../composition/status/ac-status-mod";
import featContribution from "../composition/feat-contribution";
import { Tags } from "../tags";
import { EquipmentSheet, EquipmentSlot } from "../../equipment-sheet2/types";

const displayName: EveryTree = 'ac'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const TERMINAL_TAGS: Tags[] = ['ac']

    if (!owner) throw Error('relevant slot was not passed')

    const eqTg = Object.values(owner.es).flatMap(a => a.tags ?? [])
    const localOpts: ModNodeOpts = { ...opts, tags: [...(opts.tags ?? []), ...eqTg, ...TERMINAL_TAGS] }

    const subproblems: TreeSubproblems = {
        'base-ac': baseAc(owner, localOpts),
        'ac-from-dex': acFromDex(owner, localOpts),
        "ac-of-equipment": acOfEquipment(owner, localOpts),
        'ac-feat-mod': featContribution('ac-feat-mod')(owner, localOpts),
        'ac-status-mod': acStatusMod(owner, localOpts),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}
