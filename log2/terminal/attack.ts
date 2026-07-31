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

const displayName: EveryTree = 'attack'

export default (owner: OwnerLog2) => {
    // add tags from equipment
    const TERMINAL_TAGS: Tags[] = ['standard-attack']

    if (!owner.relevantSlot) throw Error('relevant slot was not passed')

    const eqTg = owner?.relevantSlot?.tags || []
    mutateOwnerTags(owner, ...eqTg, ...TERMINAL_TAGS)

    const subproblems: TreeSubproblems = {
        'effective-attack-stat': effectiveAttackStat(owner),
        'base-attack-bonus': baseAttackBonus(owner),
        'attack-feat-mod': featContribution('attack-feat-mod')(owner),
        'attack-status-mod': attackStatusMod(owner),
        'attack-from-equipment': attackEquipmentMod(owner),
    }
    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}