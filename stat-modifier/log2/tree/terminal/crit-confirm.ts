// this is an attack roll with the possibility of adding confirm modifiers

import newModNode, { sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import effectiveAttackStat from "../composition/effective-attack-stat";
import baseAttackBonus from "../composition/base-attack-bonus";
import attackFeatMod from "../composition/attack-feat-mod";
import attackStatusMod from "../composition/attack-status-mod";
import attackEquipmentMod from "../composition/attack-equipment-mod";
import attack from "./attack";
import critConfirmMod from "../composition/crit-confirm-mod";

const displayName: EveryTree = 'crit-confirm'

const critConfirm = (owner: OwnerMaximal) => {
    const subproblems: TreeSubproblems = {
        'attack': attack(owner),
        'crit-confirm-mod': critConfirmMod(owner),
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default critConfirm