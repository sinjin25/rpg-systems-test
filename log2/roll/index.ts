// the max dex from a piece of equipment

import { default as newModNode, ModNode, sumFunc, leaf } from "..";
import { OwnerLog2, EveryTree, TreeSubproblems, RollSidesMod } from "../types";
import acOfEquipment from "../composition/ac/ac-of-equipment";
import acFromDex from "../composition/ac/ac-from-dex";
import baseAc from "../bases/base-ac";
import acStatusMod from "../composition/status/ac-status-mod";
import featContribution from "../composition/feat-contribution";
import { mutateOwnerTags, Tags } from "../tags";
import { EquipmentSheet, EquipmentSlot } from "../../equipment-sheet2/types";
import sides from "./sides";
import roll from "../../roll";

const displayName: EveryTree = 'roll'

export default (diceSides = 20, diceNumber = 1, member?: RollSidesMod,) => (owner: OwnerLog2): ModNode => {

    const subtree: ModNode[] = []
    for (let i = 0; i < diceNumber; i++) {
        const sideBoost = member ? sides(member)(owner) : undefined

        if (sideBoost) {
            const total = diceSides + sideBoost.total()
            const r = roll(total)
            subtree.push({
                displayName: `1d${total}`,
                children: [sideBoost],
                total: () => r,
            })
        } else {
            const r = roll(diceSides)
            subtree.push(leaf(`1d${diceSides}`, r))
        }
    }

    // create a ModNode
    return {
        displayName,
        children: subtree,
        total: () => {
            if (subtree.length === 0) return 0
            return sumFunc(subtree)
        }
    }
}