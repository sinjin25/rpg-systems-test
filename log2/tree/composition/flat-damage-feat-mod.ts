import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'flat-damage-feat-mod'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'flat-damage-feat-mod'), sumFunc)