import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../../types";
import statusContribution from "./status-contribution";

const displayName: EveryTree = 'damage-taken-status-mod'

export default (owner: OwnerMaximal) => statusContribution(displayName)(owner)