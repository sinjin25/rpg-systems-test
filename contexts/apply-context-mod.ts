import { BroadContexts, ContextNames } from "."
import { FeatContext } from "../feat/core-types"

export const applyContextMod = <T, D>(
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
