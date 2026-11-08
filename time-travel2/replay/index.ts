import { AnyStoredLog, AnyAugmentedLog, StoredLog, TimeTravelReplayer, TimeTravelAugmenter } from "./types"
import { TTLogKeys } from "../types"

const newTimeTravelLogReplayer = <AugmentedMap extends { [K in TTLogKeys]: unknown } = { [K in TTLogKeys]: StoredLog<K> }>(
    augmenter?: TimeTravelAugmenter<AugmentedMap>,
): TimeTravelReplayer<AugmentedMap> => ({
    augmenter,
    logs: [],
    appendLog(...ttls) {
        for (const t of ttls) this.logs.push(t)
    },
    replayCursor: 0,
    // currently this doesn't apply augment steps (as playback does)
    // don't feel like solving this yet because it's more of a philosophical question
    replayStep() {
        const l = this.logs[this.replayCursor] ?? null
        if (l === null) return l
        this.replayCursor++
        return l
    },
    playback() {
        const out: AnyAugmentedLog<AugmentedMap>[] = []
        let log = this.replayStep()
        while (log !== null) {
            const fn = (this.augmenter?.[log.kind] ?? ((l: AnyStoredLog) => l)) as (l: AnyStoredLog) => AnyAugmentedLog<AugmentedMap>
            out.push(fn(log))
            log = this.replayStep()
        }
        return out
    },
})

export default newTimeTravelLogReplayer
