import { deriveBonus } from "../../class-level2/derive";
import { BaseSaves, EveryTree, ModNodeOpts, OwnerLog2, Saves } from "../types";
const displayName: Record<Saves, BaseSaves> = {
    fortitude: 'base-fortitude',
    reflex: 'base-reflex',
    will: 'base-will',
}

export default (owner: OwnerLog2, saveType: Saves, opts: ModNodeOpts = {}) =>
    deriveBonus(owner.cs.levels, saveType, displayName[saveType])
