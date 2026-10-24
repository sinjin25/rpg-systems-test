// the maximum a die could roll once all side-count modifiers are applied - this is what
// counts as a modified "nat max" (e.g. nat 20 on a d20 widened to a d22)
import { leaf, ModNode, newModNode, sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2, RollSidesMod } from "../types";
import sides from "./sides";

const displayName: EveryTree = 'maximum-dice-sides'

export default (diceSides: number, member?: RollSidesMod) =>
    (owner: OwnerLog2, opts: ModNodeOpts = {}): ModNode => {
        const sideBoost = member ? sides(member)(owner, opts) : undefined
        const baseSides = leaf('original-dice-sides' as EveryTree, diceSides)
        const children = sideBoost ? [baseSides, sideBoost] : [baseSides]

        return newModNode(displayName, children, sumFunc)
    }
