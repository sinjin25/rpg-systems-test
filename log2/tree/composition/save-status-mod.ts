import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectStatusContributions } from "../../collect-status-contributions";

const displayName: EveryTree = 'save-status-mod'

// Status contribution to a save. Native, a mirror of attack-status-mod: every status on owner.ss that
// declares a 'save-status-mod' contribution returns its own ModNode (undefined when it doesn't apply,
// so it leaves no leaf), and we sum them. Shared by fortitude and reflex, same as save-feat-mod.
const saveStatusMod = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'save-status-mod'), sumFunc)

export default saveStatusMod
