import { FinalStandardActionResult } from "../../../actor2/act"
import freezeModNodeRecursive from "../snapshot/mod-node"
import { FrozenStandardActionResult, SARLog, TeamVictoryLog, TimeTravelContext, TimeTravelLogType } from "../types"

const logName: TimeTravelLogType = 'team-victory' as const

const teamVictoryToTT = (
    context: TimeTravelContext,
    log: {
        kind: 'team-victory'
    }
): TeamVictoryLog => {
    const l = log as TeamVictoryLog

    return {
        context,
        ...l,
    }
}

export default teamVictoryToTT
