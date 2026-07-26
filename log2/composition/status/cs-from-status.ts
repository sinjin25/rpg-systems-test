import newModNode, { ModNode, sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../../types";

type Member = 'str' | 'con' | 'dex'
const collectStatusContributions = (
    owner: OwnerMaximal,
    broadContext: EveryTree
): ModNode[] => {
    const v = Object.values(owner.ss)

    const relevant = v.map(a => a.broadContexts?.[broadContext])
        .filter(f => !!f) // return ones without a handler there
        .map(f => f(owner)) // apply the handler
        .filter(v => !!v) // remove ones that didn't apply (returned undefined)

    return relevant
}

export default (member: Member) => (owner: OwnerMaximal) => {
    const treeName: EveryTree = `${member}-from-status`
    return newModNode(treeName, collectStatusContributions(owner, treeName), sumFunc)
}