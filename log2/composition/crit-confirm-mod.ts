import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerLog2 } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-confirm-mod'

export default (owner: OwnerLog2) => featContribution(displayName)(owner)