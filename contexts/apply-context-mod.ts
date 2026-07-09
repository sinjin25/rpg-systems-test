import { BroadContexts, ContextNames } from "."
import { FeatContext, FeatModRequiredData } from "../feat/core-types"
import { ModResult } from "../stat-modifier/log"

// for a given broad context, and a list of sources (from feats, equipment, etc., located if they have a key for the relevant broadContext and, if so, apply)
// returns one entry per applying source so callers can show a per-source breakdown
export const applyContextMod = <T, D extends Partial<FeatModRequiredData>>(
    sources: T[],
    getContextMap: (source: T) => FeatContext | undefined,
    getDisplayName: (source: T) => string,
    data: D,
    context: ContextNames[],
    broadContext: BroadContexts,
): ModResult => {
    return sources.reduce((acc: ModResult, source) => {
        const map = getContextMap(source)
        const entry = map?.[broadContext]
        if (entry && entry.applies(context)) {
            const amount = entry.mod(data)
            acc.total += amount
            acc.entries.push({ displayName: getDisplayName(source), amount })
        }
        return acc
    }, { total: 0, entries: [] })
}

export default applyContextMod
