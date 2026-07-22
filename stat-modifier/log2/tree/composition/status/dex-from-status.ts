import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "./collect-status-contributions";

const displayName: EveryTree = 'dex-from-status'

// sums every dex-affecting status found on the runtime status sheet. Empty sheet -> no children
// -> 0 (sumFunc is safe on empty children).
const calc = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'dex-from-status'), sumFunc)

export default calc
