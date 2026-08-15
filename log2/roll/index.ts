// the max dex from a piece of equipment

import { ModNode, sumFunc, leaf } from "..";
import { OwnerLog2, EveryTree, RollSidesMod } from "../types";
import sides from "./sides";
import roll from "../../roll";

const displayName: EveryTree = 'roll-total'

export default (diceSides = 20, diceNumber = 1, member?: RollSidesMod,) => (owner: OwnerLog2): ModNode => {

    const subtree: ModNode[] = []
    for (let i = 0; i < diceNumber; i++) {
        const sideBoost = member ? sides(member)(owner) : undefined

        if (sideBoost) {
            const BASE_SIDES = leaf('base-sides', diceSides)
            const total = BASE_SIDES.total() + sideBoost.total()
            const r = roll(total)
            subtree.push({
                displayName: `roll 1d${total}`,
                children: [sideBoost, BASE_SIDES],
                total: () => r,
            })
        } else {
            const BASE_SIDES = leaf('base-sides', diceSides)
            const total = BASE_SIDES.total() + 0
            const r = roll(diceSides)
            subtree.push({
                displayName: `roll 1d${total}`,
                children: [BASE_SIDES],
                total: () => r,
            })
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