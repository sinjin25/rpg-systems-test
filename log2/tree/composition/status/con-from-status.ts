import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "../../../collect-status-contributions";

const displayName: EveryTree = 'con-from-status'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'con-from-status'), sumFunc)
