import { ContextNames } from "../../contexts"
import { FeatContext, FeatModRequiredData } from "../../feat/core-types"
import { ModResult } from "../../stat-modifier/log"

export type ScaledDamageSplit = {
    // the portion of 'damage' that gets multiplied by the crit multiplier
    scaled: ModResult,
    // the portion that's added on afterward, unmultiplied (e.g. Power Attack)
    flat: ModResult,
}

const emptySplit = (): ScaledDamageSplit => ({
    scaled: { total: 0, entries: [] },
    flat: { total: 0, entries: [] },
})

// Splits a source list's 'damage' contribution into a scaled and a flat bucket. A source
// only lands in 'scaled' if it ALSO defines an applying 'critMultiplier' entry - scaling is
// opt-in, so a source that never mentions 'critMultiplier' (e.g. Power Attack) stays flat
// by default, keeping crit damage from scaling multiplicatively out of control.
export const splitScaledDamage = <T, D extends Partial<FeatModRequiredData>>(
    sources: T[],
    getContextMap: (source: T) => FeatContext | undefined,
    getDisplayName: (source: T) => string,
    data: D,
    context: ContextNames[],
): ScaledDamageSplit => {
    return sources.reduce((acc, source) => {
        const map = getContextMap(source)
        const damageEntry = map?.damage
        if (!damageEntry || !damageEntry.applies(context)) return acc

        const amount = damageEntry.mod(data)
        const entry = { displayName: getDisplayName(source), amount }

        const critMultiplierEntry = map?.critMultiplier
        const scales = !!critMultiplierEntry && critMultiplierEntry.applies(context)

        const bucket = scales ? acc.scaled : acc.flat
        bucket.total += amount
        bucket.entries.push(entry)
        return acc
    }, emptySplit())
}

export default splitScaledDamage
