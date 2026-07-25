import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "../../../collect-status-contributions";

const displayName: EveryTree = 'str-from-status'

// sums every str-affecting status found on the runtime status sheet. Empty sheet -> no children
// -> 0 (sumFunc is safe on empty children).
const calc = (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'str-from-status'), sumFunc)

export default calc
