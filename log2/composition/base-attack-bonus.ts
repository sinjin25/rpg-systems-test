import { deriveBonus } from "../../class-level2/derive";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";

const displayName: EveryTree = 'base-attack-bonus'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    /* console.log('owner', owner.cs.levels) */
    return deriveBonus(owner.cs.levels, 'attackBonus', displayName)
}
