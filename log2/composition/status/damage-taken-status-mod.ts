import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerLog2 } from "../../types";
import statusContribution from "./status-contribution";

const displayName: EveryTree = 'damage-taken-status-mod'

export default (owner: OwnerLog2) => statusContribution(displayName)(owner)