import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectFeatContributions } from "../../../collect-feat-contributions";

const displayName: EveryTree = 'ac-feat-mod'

// Feat contribution to AC. Native, same shape as attack-feat-mod: sum every feat that declares an
// 'ac-feat-mod' contribution (Dodgy +4 always; Shield/Heavy Armor Mastery +1 when their gear is worn).
const acFeatMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'ac-feat-mod'), sumFunc)

export default acFeatMod
