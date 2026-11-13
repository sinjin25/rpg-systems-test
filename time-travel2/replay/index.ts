import { AnyStoredLog, AnyAugmentedLog, StoredLog, TimeTravelReplayer, TimeTravelAugmenter } from "./types"
import { TTLogKeys } from "../types"

// Methods close over `self` instead of using `this` — see map/time-travel/replay/index.ts
// for why (PuerTS's ScriptObject.Get<T> pulls a method off as a detached function
// value with no receiver binding, so a `this`-based method breaks when called
// cross-boundary). Keeping this in lock step with that file.
const newTimeTravelLogReplayer = <AugmentedMap extends { [K in TTLogKeys]: unknown } = { [K in TTLogKeys]: StoredLog<K> }>(
    augmenter?: TimeTravelAugmenter<AugmentedMap>,
): TimeTravelReplayer<AugmentedMap> => {
    const self: TimeTravelReplayer<AugmentedMap> = {
        augmenter,
        swapAugmenter(nextAugmenter) {
            self.augmenter = nextAugmenter
        },
        logs: [],
        appendLog(...ttls) {
            for (const t of ttls) self.logs.push(t)
        },
        replayCursor: 0,
        // currently this doesn't apply augment steps (as playback does)
        // don't feel like solving this yet because it's more of a philosophical question
        replayStep() {
            const l = self.logs[self.replayCursor] ?? null
            if (l === null) return l
            self.replayCursor++
            return l
        },
        playback() {
            const out: AnyAugmentedLog<AugmentedMap>[] = []
            let log = self.replayStep()
            while (log !== null) {
                const fn = (self.augmenter?.[log.kind] ?? ((l: AnyStoredLog) => l)) as (l: AnyStoredLog) => AnyAugmentedLog<AugmentedMap>
                out.push(fn(log))
                log = self.replayStep()
            }
            return out
        },
    }
    return self
}

export default newTimeTravelLogReplayer
