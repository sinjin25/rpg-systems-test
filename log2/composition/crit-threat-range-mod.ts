import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-threat-range-mod'
export default (owner: OwnerLog2) => featContribution(displayName)(owner)