// a roll of one or more dice, as a ModNode tree

import { ModNode, sumFunc } from "..";
import { OwnerLog2, EveryTree, RollSidesMod, ModNodeOpts } from "../types";
import finalSides from "./final-sides";
import roll from "../../roll";

const displayName: EveryTree = 'roll-total'

type Log2RollOpts = {
    diceSides?: number,
    diceNumber?: number,
    member?: RollSidesMod,
}

const DEFAULTS = {
    diceSides: 20,
    diceNumber: 1,
    member: undefined,
}

export default (diceOpts: Log2RollOpts = {}) =>

    (owner: OwnerLog2, opts: ModNodeOpts): ModNode => {
        const { diceNumber, diceSides, member } = { ...DEFAULTS, ...diceOpts }
        // no instance => global rng
        const rollWith = opts.rollInstance ? opts.rollInstance.roll : roll

        const subtree: ModNode[] = []
        for (let i = 0; i < diceNumber; i++) {
            const sidesNode = finalSides(diceSides, member)(owner, opts)
            const total = sidesNode.total()
            const r = rollWith(total)

            subtree.push({
                displayName: `roll 1d${total}`,
                children: [sidesNode],
                total: () => r,
            })
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
