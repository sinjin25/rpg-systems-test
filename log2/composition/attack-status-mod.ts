import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectStatusContributions } from "../collect-status-contributions";

const displayName: EveryTree = 'attack-status-mod'

export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'attack-status-mod'), sumFunc)