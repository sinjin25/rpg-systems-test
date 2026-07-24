import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'save-feat-mod'

// Feat contribution to a save. Native, a mirror of attack-feat-mod: every feat on owner.fs that declares
// a 'save-feat-mod' contribution returns its own ModNode (0/undefined when its gate fails), and we sum
// them. Fortitude and reflex share this bucket; a feat that only touches one save gates itself on the
// relevant stat context rather than declaring a separate node.
const saveFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'save-feat-mod'), sumFunc)

export default saveFeatMod
