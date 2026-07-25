import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../collect-feat-contributions";

const displayName: EveryTree = 'crit-multiplier-mod'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'crit-multiplier-mod'), sumFunc)