import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../../types";
import statusContribution from "./status-contribution";

const displayName: EveryTree = 'ac-status-mod'

export default (owner: OwnerMaximal) =>
    statusContribution(displayName)(owner)
