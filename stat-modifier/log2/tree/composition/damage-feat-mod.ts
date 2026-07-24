import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'damage-feat-mod'

// Feat contribution to an attack. Native now: every feat on owner.fs that declares an 'attack-feat-mod'
// contribution returns its own ModNode (a flat leaf, 0 when its weapon-tag gate fails), and we sum them.
// The old legacy context-tag bridge (calculateFeatMod + modResultToNode) is gone.
const damageFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'damage-feat-mod'), sumFunc)

export default damageFeatMod
