import { setTimeout as delay } from 'node:timers/promises'
import { Actor2Snapshot } from '../snapshot/actor'
import { TimeTravelReplayerVisualizer } from './types'

const DELAY = 100
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
    "speed": async (log) => {
        console.log(
            cc.dim,
            'Speed order:',
            log.actors.map(a => displayActor(a)).join(' '),
            cc.reset,
        )
    },
    "team-victory": async (log) => {
        console.log(cc.BgGreen, `Victory: ${log.winner}`, cc.reset)
    },
    "act-start": async (log) => {
        console.log(`${displayActor(log.source)} acts`, cc.reset)
    },
    'damage-over-time-taken': async (log) => {
        const actor = log.to[0]!
        console.log(`${displayActor(actor)} takes`, log.modNode.total, `damage from ${log.statusSource.displayName}`, `health is now ${actor.health.curr}`, cc.reset)
        await delay(DELAY)
    },
    'ability': async (log) => {
        const source = log.source
        const to = log.to?.[0]!
        if (log.dc && log.save) {
            const saved = log.type === 'success'
            const verb = saved ? 'saves against' : 'fails to save against'
            console.log(
                `${displayActor(to, cc.BgRed)} ${verb} ${displayActor(source)} (${log.save.total} vs ${log.dc.total})`,
            )
        }
        const dmg = log.damage?.reduce((sum, n) => sum + n.total, 0)
        if (dmg) console.log(`${displayActor(to, cc.BgRed)} takes ${dmg} damage`)
        const heal = log.heal?.reduce((sum, n) => sum + n.total, 0)
        if (heal) console.log(`${displayActor(to, cc.BgGreen)} heals ${heal}`)
        if (log.statusEffect?.length) {
            console.log(
                `${displayActor(to, cc.BgRed)} gains`,
                log.statusEffect.map(s => s.displayName).join(', '),
            )
        }
        await delay(DELAY)
    }
}

export default ttrvTextVisualizer
