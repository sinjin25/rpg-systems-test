import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'damage-taken-feat-mod'

// Feat contribution to incoming damage, from the DEFENDER's perspective (e.g. damage reduction feats).
// Feats-first placeholder like crit-multiplier-mod: no native damage-taken feat exists yet, so this is
// empty -> 0 until one is authored. Present so the terminal already has the slot wired.
const damageTakenFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'damage-taken-feat-mod'), sumFunc)

export default damageTakenFeatMod
