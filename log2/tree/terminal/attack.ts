// the full attack modifier (before the roll): the effective stat + BAB + the feat/status/equipment
// contributions, all summed. See attack-readme.md for which children are still bridged to legacy.

import newModNode, { sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import effectiveAttackStat from "../composition/effective-attack-stat";
import baseAttackBonus from "../composition/base-attack-bonus";
import attackFeatMod from "../composition/attack-feat-mod";
import attackStatusMod from "../composition/attack-status-mod";
import attackEquipmentMod from "../composition/attack-equipment-mod";

const displayName: EveryTree = 'attack'

const attack = (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'effective-attack-stat': effectiveAttackStat(owner),
        'base-attack-bonus': baseAttackBonus(owner),
        'attack-feat-mod': attackFeatMod(owner),
        'attack-status-mod': attackStatusMod(owner),
        'attack-equipment-mod': attackEquipmentMod(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default attack
