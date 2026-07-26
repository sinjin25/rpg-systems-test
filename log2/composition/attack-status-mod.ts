import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import statusContribution from "./status/status-contribution";

const displayName: EveryTree = 'attack-status-mod'

export default (owner: OwnerMaximal) => statusContribution(displayName)(owner)