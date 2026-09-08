import newModNode, { sumFunc } from "..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-threat-range-mod'
export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => featContribution(displayName)(owner, opts)
