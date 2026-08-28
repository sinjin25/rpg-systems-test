import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'flat-damage'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) =>
    newModNode(displayName, [featContribution('flat-damage-feat-mod')(owner, opts)], sumFunc)
