import { setTimeout as delay } from 'node:timers/promises'
import { Actor2Snapshot } from '../snapshot/actor'
import { TimeTravelAugmenter, AnyAugmentedLog } from './types'
import { TTLogKeys, FrozenModNode } from '../types'

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
    return `${color}${(actor.owner.cs.flavorSheet?.displayName ?? '') + actor.id}${cc.reset}`
}

export type TextAugmentedLog<K extends TTLogKeys> = {
    kind: K
    logCalls: unknown[][] // one entry per console.log call, in order
    delayMs?: number // pacing delay to apply after logging, if any
}

export type TextAugmentedLogMap = {
    [K in TTLogKeys]: K extends 'standard-action-result'
    // SAR hands back the frozen attack tree (mirrors old debug behavior)
    ? TextAugmentedLog<K> & { attackResult?: FrozenModNode }
    : TextAugmentedLog<K>
}

export const ttrvTextAugmenter: TimeTravelAugmenter<TextAugmentedLogMap> = {
    "fight-start": (log) => ({
        kind: 'fight-start',
        // fight-start output currently carries no context; placeholder until it does.
        logCalls: [[cc.BgGreen, 'Fight start', cc.reset]],
    }),
    "standard-action-result": (log) => {
        const result = log.modNodes.critDamageResult ? 'crits' : log.modNodes.damageResult ? 'hits' : 'misses'
        const dmg = log.modNodes?.damageTakenResult?.total
        const target = log.to?.[0]
        return {
            kind: 'standard-action-result',
            logCalls: [[
                displayActor(log.source),
                result,
                target ? displayActor(target, cc.BgRed) : '',
                dmg !== undefined ? `for ${dmg}` : ''
            ]],
            delayMs: DELAY,
            attackResult: log.modNodes.attackResult,
        }
    },
    "speed": (log) => ({
        kind: 'speed',
        logCalls: [[
            cc.dim,
            'Speed order:',
            log.actors.map(a => displayActor(a)).join(' '),
            cc.reset,
        ]],
    }),
    "team-victory": (log) => ({
        kind: 'team-victory',
        logCalls: [[cc.BgGreen, `Victory: ${log.winner}`, cc.reset]],
    }),
    "act-start": (log) => ({
        kind: 'act-start',
        logCalls: [[`${displayActor(log.source)} acts`, cc.reset]],
    }),
    'damage-over-time-taken': (log) => {
        const actor = log.to[0]!
        return {
            kind: 'damage-over-time-taken',
            logCalls: [[
                `${displayActor(actor)} takes`, log.modNode.total,
                `damage from ${log.statusSource.displayName}`,
                `health is now ${actor.health.curr}`, cc.reset
            ]],
            delayMs: DELAY,
        }
    },
    'heal-over-time-taken': (log) => {
        const actor = log.to[0]!
        return {
            kind: 'heal-over-time-taken',
            logCalls: [[
                `${displayActor(actor, cc.BgGreen)} heals`, log.modNode.total,
                `from ${log.statusSource.displayName}`,
                `health is now ${actor.health.curr}`, cc.reset
            ]],
            delayMs: DELAY,
        }
    },
    'actor-death': (log) => ({
        kind: 'actor-death',
        logCalls: [[cc.BgRed, `${displayActor(log.source)} died`, cc.reset]],
    }),
    'ability': (log) => {
        const source = log.source
        const to = log.to?.[0]!
        const logCalls: unknown[][] = []
        if (log.dc && log.save) {
            const saved = log.type === 'success'
            const verb = saved ? 'saves against' : 'fails to save against'
            logCalls.push([
                `${displayActor(to, cc.BgRed)} ${verb} ${displayActor(source)} (${log.save.total} vs ${log.dc.total})`,
            ])
        }
        const dmg = log.damageTaken?.reduce((sum, n) => sum + n.total, 0)
        if (dmg) logCalls.push([`${displayActor(to, cc.BgRed)} takes ${dmg} damage`])
        const heal = log.heal?.reduce((sum, n) => sum + n.total, 0)
        if (heal) logCalls.push([`${displayActor(to, cc.BgGreen)} heals ${heal}`])
        if (log.statusEffect?.length) {
            logCalls.push([
                `${displayActor(to, cc.BgRed)} gains`,
                log.statusEffect.map(s => s.displayName).join(', '),
            ])
        }
        return {
            kind: 'ability',
            logCalls,
            delayMs: DELAY,
        }
    },
    'pre-fight-feat-applied': (log) => ({
        kind: 'pre-fight-feat-applied',
        logCalls: [[
            cc.dim,
            `${displayActor(log.source)} feat(s) trigger:`,
            log.featsTriggered.join(', '),
            cc.reset,
        ]],
    }),
    'post-fight': (log) => ({
        kind: 'post-fight',
        logCalls: [[cc.dim, `${displayActor(log.source)} cleaned up post-fight`, cc.reset]],
    }),
}

export const consumeTextAugmentedLogs = async (
    logs: AnyAugmentedLog<TextAugmentedLogMap>[]
) => {
    for (const log of logs) {
        for (const args of log.logCalls) console.log(...args)
        if (log.delayMs) await delay(log.delayMs)
    }
}

export default ttrvTextAugmenter
