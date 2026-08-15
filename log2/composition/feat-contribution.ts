import { FeatBroadContexts, OwnerLog2 } from "../types";
import newModNode, { sumFunc, type ModNode } from '../index'

const collectFeatContributions = (
    owner: OwnerLog2,
    broadContext: FeatBroadContexts, // a subset of EveryTree, so we know where people are getting their shit from
): ModNode[] => {
    const entries = Object.values(owner.fs)

    const relevant = entries.map(f => f.broadContexts?.[broadContext])
        .filter(f => !!f) // it has a handler for the given broadContext
        .map(f => f(owner)) // run the handler
        .filter(n => !!n) // node exists (as opposed to being undefined)

    return relevant
}

export default (broadContext: FeatBroadContexts) => (owner: OwnerLog2): ModNode => {
    const children = collectFeatContributions(owner, broadContext)

    return newModNode(
        broadContext,
        children,
        sumFunc,
    )
}