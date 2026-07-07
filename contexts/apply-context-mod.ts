import { BroadContexts, ContextNames } from "."
import { FeatContext, FeatModRequiredData } from "../feat/core-types"

// for a given broad context, and a list of sources (from feats, equipment, etc., located if they have a key for the relevant broadContext and, if so, apply)
export const applyContextMod = <T, D extends Partial<FeatModRequiredData>>(
    sources: T[],
    getContextMap: (source: T) => FeatContext | undefined,
    data: D,
    context: ContextNames[],
    broadContext: BroadContexts,
) => {
    return sources.reduce((acc, source) => {
        const map = getContextMap(source)
        const entry = map?.[broadContext]
        if (entry && entry.applies(context)) return acc + entry.mod(data)
        return acc
    }, 0)
}

export default applyContextMod
