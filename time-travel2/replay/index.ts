import { AnyStoredLog, TimeTravelReplayer, TimeTravelReplayerVisualizer } from "./types"

const newTimeTravelLogReplayer = (
    visualizer: TimeTravelReplayerVisualizer,
): TimeTravelReplayer => ({
    visualizer,
    logs: [],
    appendLog(...ttls) {
        for (const t of ttls) this.logs.push(t)
    },
    replayCursor: 0,
    replayStep() {
        const l = this.logs[this.replayCursor] ?? null
        if (l === null) return l
        this.replayCursor++
        return l
    },
    async playback() {
        let log = this.replayStep()
        while (log !== null) {
            const handler = this.visualizer[log.kind] as (l: AnyStoredLog) => Promise<unknown>
            await handler(log)
            log = this.replayStep()
        }
    },
})

export default newTimeTravelLogReplayer
