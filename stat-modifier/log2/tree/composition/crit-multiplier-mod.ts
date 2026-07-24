import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'crit-multiplier-mod'

// Feat increments to the crit multiplier (e.g. a feat that bumps a x2 weapon to x3 adds +1 here).
// Feats-first, like crit-confirm-mod; equipment/status auto-confirm-style sources break out later.
// Empty until a native multiplier feat exists -> no children -> 0, leaving the weapon base alone.
const critMultiplierMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'crit-multiplier-mod'), sumFunc)

export default critMultiplierMod
