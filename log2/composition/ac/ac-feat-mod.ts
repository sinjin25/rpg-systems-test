import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'ac-feat-mod'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'ac-feat-mod'), sumFunc)
