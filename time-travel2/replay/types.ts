import { TTLogMap, TTLogKeys, FrozenModNode } from "../types"

// the stored/frozen log for a kind = exactly what the to-TT handler produced
export type StoredLog<K extends TTLogKeys> = TTLogMap[K]['output']
// discriminated union of all stored logs (kind is the discriminant)
export type AnyStoredLog = TTLogMap[TTLogKeys]['output']

// per-kind visualizer return type; default to void, override where meaningful.
// use a conditional per key (not intersection) so overrides replace rather than
// intersect (`void & FrozenModNode`).
export type ReplayReturnMap = {
    [K in TTLogKeys]: K extends 'standard-action-result'
    // SAR handler hands back the frozen attack tree (mirrors old debug behavior)
    ? FrozenModNode | undefined
    : void
}

export type TimeTravelReplayerVisualizer = {
    [K in TTLogKeys]: (log: StoredLog<K>) => Promise<ReplayReturnMap[K]>
}

export type TimeTravelReplayer = {
    visualizer: TimeTravelReplayerVisualizer
    logs: AnyStoredLog[]
    appendLog(...ttls: AnyStoredLog[]): void
    replayStep(): AnyStoredLog | null
    replayCursor: number
    playback(): Promise<void>
}
