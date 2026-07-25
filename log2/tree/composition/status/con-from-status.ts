import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "../../../collect-status-contributions";

const displayName: EveryTree = 'con-from-status'

// sums every con-affecting status found on the runtime status sheet. Empty sheet -> no children
// -> 0 (sumFunc is safe on empty children). Mirrors dex-from-status.
const calc = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'con-from-status'), sumFunc)

export default calc
