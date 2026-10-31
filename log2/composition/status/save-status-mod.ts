import newModNode, { sumFunc } from "../..";
import { EveryTree, ModNodeOpts, OwnerLog2, Saves } from "../../types";
import statusContribution from "./status-contribution";

export default (member: Saves) => (owner: OwnerLog2, opts: ModNodeOpts = {}) =>
    statusContribution(`${member}-status-mod`)(owner, opts)
