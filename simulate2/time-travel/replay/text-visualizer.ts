import { TimeTravelReplayerVisualizer } from './types'

const stub = async () => { return undefined }

const ttrvTextVisualizer: TimeTravelReplayerVisualizer = {
    "act-start": stub,
    "actions-elapsed": stub,
    "damage-over-time": stub,
    "decay-actions-elapsed": stub,
    "decay-rounds-elapsed": stub,
    "decay-save-succeeded": stub,
    "enemy-killed": stub,
    "handle-potential-death": stub,
    "resolve-participants": stub,
    "rounds-elapsed": stub,
    "save-succeeded": stub,
    "speed-elapsed": stub,
    // stub: hand the frozen attack tree back to confirm the SARLog type is received intact
    "standard-action-result": async (log) => {
        console.log(log.modNodes.attackResult)
        return log.modNodes.attackResult
    },
    "team-victory": stub,
    ability: stub,
    round: stub,
}

export default ttrvTextVisualizer