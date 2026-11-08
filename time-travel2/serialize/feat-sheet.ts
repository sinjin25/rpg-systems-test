import registry from "../../feat2/registry"
import { FeatIds, FeatSheet } from "../../feat2/types"

export const serializeFeatSheet = (fs: FeatSheet): FeatIds[] => {
    return Object.keys(fs) as FeatIds[]
}

// fallback is used for things like testing (ex: pass in owner.fs)
// you should rarely need to do this
export const deserializeFeatSheet = (ids: FeatIds[], fallback?: FeatSheet): FeatSheet => {
    const fs: FeatSheet = {}
    for (let key of ids) {
        if (registry[key]) fs[key] = registry[key]
        if (fallback && fallback[key]) fs[key] = fallback[key]
    }
    return fs
}
