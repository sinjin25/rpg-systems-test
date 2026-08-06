import newModNode, { ModNode, sumFunc } from "../..";
import { EveryTree, OwnerLog2 } from "../../types";

type Member = 'str' | 'con' | 'dex' | 'int'
const collectStatusContributions = (
    owner: OwnerLog2,
    broadContext: EveryTree
): ModNode[] => {
    const v = Object.values(owner.ss)

    const relevant = v.map(a => a.broadContexts?.[broadContext])
        .filter(f => !!f) // return ones without a handler there
        .map(f => f(owner)) // apply the handler
        .filter(v => !!v) // remove ones that didn't apply (returned undefined)

    return relevant
}

export default (member: Member) => (owner: OwnerLog2) => {
    const treeName: EveryTree = `${member}-from-status`
    return newModNode(treeName, collectStatusContributions(owner, treeName), sumFunc)
}