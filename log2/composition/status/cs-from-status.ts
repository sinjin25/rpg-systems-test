import newModNode, { sumFunc } from "../..";
import { EveryTree, OwnerLog2 } from "../../types";
import { collectStatusContributions } from "./status-contribution";

type Member = 'str' | 'con' | 'dex' | 'int'

export default (member: Member) => (owner: OwnerLog2) => {
    const treeName: EveryTree = `${member}-from-status`
    return newModNode(treeName, collectStatusContributions(owner, treeName), sumFunc)
}