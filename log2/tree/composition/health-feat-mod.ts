import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../types";
import { collectFeatContributions } from "../../collect-feat-contributions";

const displayName: EveryTree = 'health-feat-mod'

export default (owner: OwnerMaximal) =>
    newModNode(displayName, collectFeatContributions(owner, 'health-feat-mod'), sumFunc)