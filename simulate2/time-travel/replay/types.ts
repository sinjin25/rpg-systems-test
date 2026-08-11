import { TimeTravelLog, TimeTravelLogType } from "../types"

// the concrete log for a kind, or a bare { kind } placeholder when none exists yet.
// tuple-wrap the never-check so the conditional doesn't distribute.
type LogFor<K extends TimeTravelLogType> =
    [Extract<TimeTravelLog, { kind: K }>] extends [never]
    ? { kind: K }
    : Extract<TimeTravelLog, { kind: K }>

export type TimeTravelReplayerVisualizer = {
    [K in TimeTravelLogType]: (log: LogFor<K>) => Promise<any>
}

export type TimeTravelReplayer = {
    visualizer: TimeTravelReplayerVisualizer
    logs: TimeTravelLog[]
    // cursor: number,
    appendLog(...ttls: TimeTravelLog[]): void,
    replayStep(): TimeTravelLog | null,
    replayCursor: number,
    playback(): Promise<void>,
}
