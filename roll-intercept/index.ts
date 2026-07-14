// ex: turn a nat 1 into a nat 20
// ex: average two rolls
// ex: roll advantage

import { StandardActionResult } from "../character/act";
import { Actor, Owner } from "../character/actor";

// see character/act/index.ts
export type InterceptRollFunction = (
    attacker: Actor,
    target: Actor,
    sar: StandardActionResult,
) => StandardActionResult

export type SheetWithIntercept = Record<string, { interceptRoll?: InterceptRollFunction } | undefined>

const collectInterceptsFromSheet = (sheet: SheetWithIntercept) => {
    const intercepts: InterceptRollFunction[] = []
    for (const entry of Object.values(sheet)) {
        const result = entry?.interceptRoll
        if (!result) continue
        intercepts.push(result)
    }

    return intercepts
}

// ss before fs: one-shot reactive statuses (e.g. Feint) need to resolve before
// standing feat modifiers (e.g. Measured Strike) so a nat-1-to-nat-20 upgrade
// pre-empts an on-miss reroll instead of the reverse. See issue #44 for the
// broader open question this doesn't fully solve (ordering within a single sheet).
export const collectIntercepts = (owner: Owner) => {
    const { fs, ss } = owner
    const intercepts: InterceptRollFunction[] = [
        ...collectInterceptsFromSheet(ss),
        ...collectInterceptsFromSheet(fs),
    ]

    return intercepts
}

// applied in resolution order: each intercept sees the result of the one before it,
// so e.g. Feint turning a nat 1 into a nat 20 pre-empts Measured Strike's "on miss" reroll
export const applyIntercepts = (
    attacker: Actor,
    target: Actor,
    sar: StandardActionResult,
    intercepts: InterceptRollFunction[],
): StandardActionResult => {
    return intercepts.reduce((acc, fn) => fn(attacker, target, acc), sar)
}