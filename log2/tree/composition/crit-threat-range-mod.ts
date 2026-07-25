import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'crit-threat-range-mod'

// Feat contributions to a weapon's threat range. Feats-first, like crit-confirm-mod /
// crit-multiplier-mod; equipment (crit amulet) and status sources break out later. Negative widens
// the range (Improved Critical contributes -1). Empty until a native crit-range feat is on owner.fs
// -> no children -> 0, leaving the weapon base alone.
const critThreatRangeMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'crit-threat-range-mod'), sumFunc)

export default critThreatRangeMod
