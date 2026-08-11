import { TimeTravelLog } from "../types"

export type TimeTravelReplayer = {
    logs: TimeTravelLog[]
    // cursor: number,
    appendLog(...ttls: TimeTravelLog[]): void,
    replayStep(): TimeTravelLog | null,
    replayCursor: number,
}

const newTimeTravelLogReplayer = (): TimeTravelReplayer => {
    return {
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
        }
    }
}

export default newTimeTravelLogReplayer