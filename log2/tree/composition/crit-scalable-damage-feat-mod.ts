import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'crit-scalable-damage-feat-mod'

// Feat contribution to the CRIT-SCALABLE damage bucket - mods eligible to be multiplied by the crit
// multiplier (e.g. an enhancement bonus). Every feat on owner.fs declaring a
// 'crit-scalable-damage-feat-mod' contribution returns its own ModNode (dropped when its gate fails);
// we sum them.
const critScalableDamageFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'crit-scalable-damage-feat-mod'), sumFunc)

export default critScalableDamageFeatMod
