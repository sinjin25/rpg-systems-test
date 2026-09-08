import newModNode, { leaf, sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import critMultiplierMod from "./crit-multiplier-mod";

const displayName: EveryTree = 'crit-multiplier'
const DEFAULT_MULTIPLIER = 1.5

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const relevantSlot = opts.relevantSlot ?? owner.es.mainhand
    if (!relevantSlot) throw Error('Need to pass in a weapon to relevantSlot')

    const handler = relevantSlot.broadContexts[displayName]

    if (!handler) return newModNode(displayName, [
        leaf(relevantSlot.displayName, DEFAULT_MULTIPLIER),
        critMultiplierMod(owner, opts),
    ], sumFunc)

    return newModNode(displayName, [
        leaf(relevantSlot.displayName, handler(owner, opts)!.total()),
        critMultiplierMod(owner, opts),
    ], sumFunc)
}
