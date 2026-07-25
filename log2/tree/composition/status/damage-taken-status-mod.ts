import newModNode, { sumFunc } from "../../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectStatusContributions } from "../../../collect-status-contributions";

const displayName: EveryTree = 'damage-taken-status-mod'

export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectStatusContributions(owner, 'damage-taken-status-mod'), sumFunc)