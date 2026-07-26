import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'flat-damage'
export default (owner: OwnerMaximal) =>
    newModNode(displayName, [featContribution('flat-damage-feat-mod')(owner)], sumFunc)