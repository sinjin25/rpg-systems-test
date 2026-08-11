import decaySaveSucceededToTT from "./to-time-travel/decay-save-succeeded-to-tt";
import standardActionResultToTT from "./to-time-travel/standard-action-result-to-tt";
import { EveryTimeTravelLog, TimeTravelContext, TimeTravelLog, TimeTravelLogType } from "./types";

// use some kind of generic?
export const toTimeTravelLog = (
    // who to whom
    context: TimeTravelContext,
    // did what?
    log: EveryTimeTravelLog,
): TimeTravelLog => {
    switch (
    log.kind
    ) {
        /* case 'decay-save-succeeded': return decaySaveSucceededToTT(context, log) */
        case 'standard-action-result': return standardActionResultToTT(context, {
            kind: log.kind,
            ...log,
        })
        default:
            throw Error(`Unexpected 'kind' key: ${log.kind}`)
    }
}