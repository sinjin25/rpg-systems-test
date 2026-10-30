import { deriveBonus } from "../../class-level2/derive";
import { BaseSaves, EveryTree, ModNodeOpts, OwnerLog2, Saves } from "../types";
const displayName: Record<Saves, BaseSaves> = {
    fortitude: 'class-fortitude',
    reflex: 'class-reflex',
    will: 'class-will',
}

export default (owner: OwnerLog2, saveType: Saves, opts: ModNodeOpts = {}) =>
    deriveBonus(owner.cs.levels, saveType, displayName[saveType])
