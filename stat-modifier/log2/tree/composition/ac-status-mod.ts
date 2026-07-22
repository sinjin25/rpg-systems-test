import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectStatusContributions } from "../../collect-status-contributions";

const displayName: EveryTree = 'ac-status-mod'

// Status contribution to AC. Native, the mirror of ac-feat-mod and attack-status-mod: sum every status on
// owner.ss that declares an 'ac-status-mod' contribution (Divine Protection +N; Studied Target -1). A
// status that doesn't apply returns undefined, so it leaves no leaf.
const acStatusMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'ac-status-mod'), sumFunc)

export default acStatusMod
