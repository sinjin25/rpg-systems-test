// the full attack modifier (before the roll): the effective stat + BAB + the feat/status/equipment
// contributions, all summed. See attack-readme.md for which children are still bridged to legacy.

import newModNode, { sumFunc } from "../..";
import { OwnerMaximal, EveryTree, TreeSubproblems } from "../types";
import effectiveAttackStat from "../composition/effective-attack-stat";
import baseAttackBonus from "../composition/base-attack-bonus";
import attackFeatMod from "../composition/attack-feat-mod";
import attackStatusMod from "../composition/attack-status-mod";
import attackEquipmentMod from "../composition/attack-equipment-mod";
import damageOfEquipmentPiece from "../bases/damage-of-equipment-piece";
import { equipmentIsWeapon } from "../../../../equipment-sheet";
import effectiveDamageStat from "../composition/effective-damage-stat";

const displayName: EveryTree = 'damage'

const damage = (owner: OwnerMaximal) => {
    const relevantSlot = owner.relevantSlot
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')
    if (!equipmentIsWeapon(relevantSlot)) throw Error('Need to pass in a weapon to relevantSlot')
    const subproblems: TreeSubproblems = {
        // fuck off
        // @ts-expect-error
        damage: damageOfEquipmentPiece(owner.relevantSlot),
        // this wouldn't cover special holding styles (one-handed w/ two hands vs one hand, etc.)
        "effective-attack-stat": effectiveDamageStat(owner),
        // add flat damage here (damage not affected by crit multi)
    }

    const subpr = Object.values(subproblems)

    return newModNode(
        displayName,
        subpr,
        () => sumFunc(subpr)
    )
}

export default damage
