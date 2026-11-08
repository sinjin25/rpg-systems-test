import { TTLogMap, TTLogKeys } from "../types"

// the stored/frozen log for a kind = exactly what the to-TT handler produced
export type StoredLog<K extends TTLogKeys> = TTLogMap[K]['output']
// discriminated union of all stored logs (kind is the discriminant)
export type AnyStoredLog = TTLogMap[TTLogKeys]['output']

// per-kind, sync, pure: turns a stored log into whatever a given target
// (text console, Unity via PuerTS, ...) needs. Each target defines its own
// AugmentedMap shape.
export type TimeTravelAugmenter<AugmentedMap extends { [K in TTLogKeys]: unknown }> = {
    [K in TTLogKeys]: (log: StoredLog<K>) => AugmentedMap[K]
}

export type AnyAugmentedLog<AugmentedMap extends { [K in TTLogKeys]: unknown }> =
    AugmentedMap[TTLogKeys]

export type TimeTravelReplayer<
    AugmentedMap extends { [K in TTLogKeys]: unknown } = { [K in TTLogKeys]: unknown }
> = {
    augmenter: TimeTravelAugmenter<AugmentedMap>
    logs: AnyStoredLog[]
    appendLog(...ttls: AnyStoredLog[]): void
    replayStep(): AnyStoredLog | null
    replayCursor: number
    // retrieves logs up to present and augments them according to the augmenter
    // (which then needs to be consumed however it does that)
    playback(): AnyAugmentedLog<AugmentedMap>[]
}
