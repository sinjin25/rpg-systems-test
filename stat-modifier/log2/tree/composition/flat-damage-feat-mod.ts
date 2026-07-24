import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'flat-damage-feat-mod'

// Feat contribution to the FLAT damage bucket - mods that are added AFTER the crit multiply and
// never scale (e.g. Power Attack, precision/sneak, elemental). Every feat on owner.fs declaring a
// 'flat-damage-feat-mod' contribution returns its own ModNode (dropped when its gate fails); summed.
const flatDamageFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'flat-damage-feat-mod'), sumFunc)

export default flatDamageFeatMod
