import newModNode, { sumFunc } from "../..";
import { EveryTree, ModNodeOpts, OwnerLog2 } from "../../types";
import { collectStatusContributions } from "./status-contribution";

type Member = 'str' | 'con' | 'dex' | 'int'

export default (member: Member) => (owner: OwnerLog2, opts: ModNodeOpts = {}) => {
    const treeName: EveryTree = `${member}-from-status`
    return newModNode(treeName, collectStatusContributions(owner, opts, treeName), sumFunc)
}
