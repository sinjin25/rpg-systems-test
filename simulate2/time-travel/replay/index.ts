import { TimeTravelLog } from "../types"
import { TimeTravelReplayer, TimeTravelReplayerVisualizer } from "./types"

const newTimeTravelLogReplayer = (
    visualizer: TimeTravelReplayerVisualizer,
): TimeTravelReplayer => {
    return {
        visualizer,
        logs: [],
        appendLog(...ttls: TimeTravelLog[]) {
            for (let ttl of ttls) {
                this.logs.push(ttl)
            }
        },
        replayCursor: 0,
        replayStep() {
            const l = this.logs[this.replayCursor] || null
            if (l === null) return l
            this.replayCursor++
            return l
        },
        async playback() {
            // walk the logs, dispatch each to its visualizer handler, and await before advancing.
            // the switch narrows log per case so visualizer[log.kind](log) typechecks without casts.
            let log = this.replayStep()
            while (log !== null) {
                switch (log.kind) {
                    case 'standard-action-result':
                        await this.visualizer[log.kind](log)
                        break
                    case 'decay-rounds-elapsed':
                        await this.visualizer[log.kind](log)
                        break
                    case 'fight-start':
                        await this.visualizer[log.kind](log)
                        break
                    case 'team-victory':
                        await this.visualizer[log.kind](log)
                        break
                    // ======= below is unimplemented =======
                    case 'resolve-participants':
                        await this.visualizer[log.kind](log)
                        break
                    case 'round':
                        await this.visualizer[log.kind](log)
                        break
                    case 'decay-save-succeeded':
                        await this.visualizer[log.kind](log)
                        break
                    case 'handle-potential-death':
                        await this.visualizer[log.kind](log)
                        break
                    case 'act-start':
                        await this.visualizer[log.kind](log)
                        break
                    case 'decay-actions-elapsed':
                        await this.visualizer[log.kind](log)
                        break
                    case 'ability':
                        await this.visualizer[log.kind](log)
                        break
                    case 'damage-over-time':
                        await this.visualizer[log.kind](log)
                        break
                }
                log = this.replayStep()
            }
        }
    }
}

export default newTimeTravelLogReplayer