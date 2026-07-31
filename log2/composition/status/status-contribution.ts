import newModNode, { ModNode, sumFunc } from "../..";
import { EveryTree, FeatBroadContexts, OwnerLog2, StatusBroadContexts } from "../../types";

const collectStatusContributions = (
    owner: OwnerLog2,
    broadContext: StatusBroadContexts, // a subset of EveryTree, so we know where people are getting their shit from
): ModNode[] => {
    const entries = Object.values(owner.ss)

    const relevant = entries.map(f => f.broadContexts?.[broadContext])
        .filter(f => !!f) // it has a handler for the given broadContext
        .map(f => f(owner)) // run the handler
        .filter(n => !!n) // node exists (as opposed to being undefined)

    return relevant
}

export default (broadContext: StatusBroadContexts) => (owner: OwnerLog2): ModNode => {
    const children = collectStatusContributions(owner, broadContext)

    return newModNode(
        broadContext,
        children,
        () => sumFunc(children)
    )
}