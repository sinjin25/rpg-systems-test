import newModNode, { sumFunc } from "..";
import { EveryTree, OwnerMaximal } from "../types";
import featContribution from "./feat-contribution";

const displayName: EveryTree = 'crit-confirm-mod'

export default (owner: OwnerMaximal) => featContribution(displayName)(owner)