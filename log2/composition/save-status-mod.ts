import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectStatusContributions } from "../collect-status-contributions";

const displayName: EveryTree = 'save-status-mod'

export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'save-status-mod'), sumFunc)