import { setTimeout as delay } from 'node:timers/promises'
import { Actor2Snapshot } from '../snapshot/actor'
import { TimeTravelReplayerVisualizer } from './types'

const DELAY = 300
const cc = {
    // https://github.com/dazecoop/nodejs-console-colors
    // Common
    reset: '\x1b[0m',
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    reverse: "\x1b[7m",

    // Text colors
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    // Background colors
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
}

const displayActor = (actor: Actor2Snapshot, color = cc.BgBlue) => {
    return `${color}${actor.owner.cs.flavorSheet?.displayName + actor.id}${cc.reset}`
}

const stub = async () => { return undefined }

const ttrvTextVisualizer: TimeTravelReplayerVisualizer = {
    "fight-start": async (log) => {
        console.log(cc.BgGreen, 'Fight start', cc.reset)
        const player = log.context.source
        console.log(cc.BgGreen, 'Player:', `Health: ${player.health.curr} / ${player.health.max}`, cc.reset)
        const enemies = log.context.to!
        console.log(cc.BgRed, `enemies:`, enemies.map(a => a.owner.cs.flavorSheet?.displayName + a.id).join(' '), cc.reset)
        // log actors
    },
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
        const result = log.modNodes.critDamageResult ? 'crits' : log.modNodes.damageResult ? 'hits' : 'misses'
        const dmg = log.modNodes?.critDamageResult?.total || log.modNodes?.damageResult?.total || undefined
        console.log(
            displayActor(log.context.source),
            result,
            displayActor(log.context.to[0]!, cc.BgRed),
            dmg !== undefined ? `for ${dmg}` : ''
        )
        await delay(DELAY)
        return log.modNodes.attackResult
    },
    "team-victory": stub,
    ability: stub,
    round: stub,
}

export default ttrvTextVisualizer