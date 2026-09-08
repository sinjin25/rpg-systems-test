import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-multiplier-mod'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) =>
    newModNode(displayName, [featContribution('crit-multiplier-feat-mod')(owner, opts)], sumFunc)
