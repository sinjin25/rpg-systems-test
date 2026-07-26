import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-multiplier-mod'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, [featContribution('crit-multiplier-mod')(owner)], sumFunc)