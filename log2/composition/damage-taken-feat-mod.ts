import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../collect-feat-contributions";

const displayName: EveryTree = 'damage-taken-feat-mod'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'damage-taken-feat-mod'), sumFunc)