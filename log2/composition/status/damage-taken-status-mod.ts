import newModNode, { sumFunc } from "../..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../../types";
import statusContribution from "./status-contribution";

const displayName: EveryTree = 'damage-taken-status-mod'

export default (owner: OwnerLog2, opts: ModNodeOpts = {}) => statusContribution(displayName)(owner, opts)
