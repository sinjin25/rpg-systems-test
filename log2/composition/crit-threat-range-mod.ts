import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-threat-range-mod'
export default (owner: OwnerMaximal) => featContribution(displayName)(owner)