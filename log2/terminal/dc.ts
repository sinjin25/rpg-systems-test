// the full attack modifier (before the roll): the effective stat + BAB + the feat/status/equipment
// contributions, all summed. See attack-readme.md for which children are still bridged to legacy.

import newModNode, { sumFunc } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems } from "../types";
import effectiveAttackStat from "../composition/effective-attack-stat";
import baseAttackBonus from "../composition/base-attack-bonus";
import attackStatusMod from "../composition/attack-status-mod";
import attackEquipmentMod from "../composition/attack-equipment-mod";
import featContribution from "../composition/feat-contribution";
import { addTags, mutateOwnerTags, Tags } from "../tags";
import effectiveSpellStat from "../composition/effective-spell-dc-stat";
import statusContribution from "../composition/status/status-contribution";
import modFromEquipment from "../composition/equipment/mod-from-equipment";

const displayName: EveryTree = 'dc'

export default (
    payload: {
        baseDc: number,
        tags?: Tags[],
    }
) => (owner: OwnerLog2) => {
    // add tags from equipment
    /* const TERMINAL_TAGS: Tags[] = ['ability'] */

    if (!owner.relevantSlot) throw Error('relevant slot was not passed')

    /* const eqTg = owner?.relevantSlot?.tags || [] */
    mutateOwnerTags(owner, /* ...eqTg, *//*  ...TERMINAL_TAGS */ ...payload.tags || [])

    const subproblems: TreeSubproblems = {
        'effective-spell-dc-stat': effectiveSpellStat(owner),
        'spell-dc-feat-mod': featContribution('spell-dc-feat-mod')(owner),
        'spell-dc-status-mod': statusContribution('spell-dc-status-mod')(owner),
        'spell-dc-from-equipment': modFromEquipment('spell-dc-from-equipment')(owner),
        'base-dc': newModNode('base-dc', [], () => payload.baseDc)
    }
    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}