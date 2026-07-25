import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectStatusContributions } from "../../collect-status-contributions";

const displayName: EveryTree = 'attack-status-mod'

// Status contribution to an attack. Native now, a mirror of attack-feat-mod: every status on owner.ss
// that declares an 'attack-status-mod' contribution returns its own ModNode (undefined when its
// weapon-tag gate fails, so it leaves no leaf), and we sum them. The old legacy context-tag bridge
// (calculateStatusMod + modResultToNode) is gone. The log2 stat-boost statuses (cats-grace,
// bulls-strength) declare no 'attack-status-mod', so they're skipped here - correct, they affect a stat.
const attackStatusMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'attack-status-mod'), sumFunc)

export default attackStatusMod
