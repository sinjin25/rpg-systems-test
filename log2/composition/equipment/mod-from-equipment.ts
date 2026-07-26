import newModNode, { ModNode, sumFunc } from "../..";
import { EveryTree, OwnerMaximal } from "../../types";

const collectEquipmentContributions = (
    owner: OwnerMaximal,
    broadContext: EveryTree
): ModNode[] => {
    const v = Object.values(owner.es)

    const relevant = v.map(a => a.broadContexts?.[broadContext])
        .filter(f => !!f) // return ones without a handler there
        .map(f => f(owner)) // apply the handler
        .filter(v => !!v) // remove ones that didn't apply (returned undefined)

    return relevant
}

export default (member: EveryTree) => (owner: OwnerMaximal) => {
    return newModNode(member, collectEquipmentContributions(owner, member), sumFunc)
}