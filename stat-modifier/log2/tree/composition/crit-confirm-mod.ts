/* 
There's a lot of layers that could exist here:
- Feats (crit focus)
- Equipment (ex: auto-confirms)
- Status

For now just build feats, then break out later
*/

import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'crit-confirm-mod'

// Feat contribution to an attack. Native now: every feat on owner.fs that declares an 'attack-feat-mod'
// contribution returns its own ModNode (a flat leaf, 0 when its weapon-tag gate fails), and we sum them.
// The old legacy context-tag bridge (calculateFeatMod + modResultToNode) is gone.
const attackFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'crit-confirm-mod'), sumFunc)

export default attackFeatMod
