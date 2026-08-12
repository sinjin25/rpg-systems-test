import { TimeTravelContext, TimeTravelLog } from '../types'
import { default as decaySaveSucceededToTT } from './decay-save-succeeded-to-tt'
import { default as fightStartToTT } from './fight-start-to-tt'
import { default as standardActionResultToTT } from './standard-action-result-to-tt'
import { default as teamVictoryToTT } from './team-victory-to-tt'

// use some kind of generic?
export const toTimeTravelLog = (
    // who to whom
    context: TimeTravelContext,
    // did what?
    log: TimeTravelLog,
): TimeTravelLog => {
    switch (
    log.kind
    ) {
        /* case 'decay-save-succeeded': return decaySaveSucceededToTT(context, log) */
        case 'standard-action-result': return standardActionResultToTT(context, {
            kind: log.kind,
            ...log,
        })
        case 'team-victory': return teamVictoryToTT(context, {
            kind: log.kind,
            ...log,
        })
        case 'fight-start': return fightStartToTT(context, { kind: log.kind, ...log })
        case 'resolve-participants':
        case 'round':
        case 'decay-save-succeeded':
        case 'handle-potential-death':
        case 'act-start':
        case 'decay-actions-elapsed':
        case 'ability':
        case 'damage-over-time':
            throw Error(`toTimeTravelLog not implemented for kind: ${log.kind}`)
        default:
            throw Error(`Unexpected 'kind' key: ${log.kind}`)
    }
}

export default toTimeTravelLog