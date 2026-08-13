import { setTimeout as delay } from 'node:timers/promises'
import { Actor2Snapshot } from '../snapshot/actor'
import { TimeTravelReplayerVisualizer } from './types'

const DELAY = 300
const cc = {
    // https://github.com/dazecoop/nodejs-console-colors
    reset: '\x1b[0m',
    dim: "\x1b[2m",

    // Background colors
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgBlue: "\x1b[44m",
}

const displayActor = (actor: Actor2Snapshot, color = cc.BgBlue) => {
    return `${color}${actor.owner.cs.flavorSheet?.displayName + actor.id}${cc.reset}`
}

const ttrvTextVisualizer: TimeTravelReplayerVisualizer = {
    "fight-start": async (log) => {
        // fight-start output currently carries no context; placeholder until it does.
        console.log(cc.BgGreen, 'Fight start', cc.reset)
    },
    // hand the frozen attack tree back to confirm the SARLog type is received intact
    "standard-action-result": async (log) => {
        const result = log.modNodes.critDamageResult ? 'crits' : log.modNodes.damageResult ? 'hits' : 'misses'
        const dmg = log.modNodes?.critDamageResult?.total || log.modNodes?.damageResult?.total || undefined
        const target = log.to?.[0]
        console.log(
            displayActor(log.source),
            result,
            target ? displayActor(target, cc.BgRed) : '',
            dmg !== undefined ? `for ${dmg}` : ''
        )
        await delay(DELAY)
        return log.modNodes.attackResult
    },
    "team-victory": async (log) => {
        console.log(cc.BgGreen, `Victory: ${log.winner}`, cc.reset)
    },
}

export default ttrvTextVisualizer
