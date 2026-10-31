import newModNode, { sumFunc } from "../..";
import { CsScore, EveryTree, ModNodeOpts, OwnerLog2 } from "../../types";
import { collectStatusContributions } from "./status-contribution";

export default (member: CsScore) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const treeName: EveryTree = `${member}-from-status`
    return newModNode(treeName, collectStatusContributions(owner, opts, treeName), sumFunc)
}
