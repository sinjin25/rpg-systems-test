import { StatusSheet } from "./types"

export type {
    StatusEffect,
    StatusExpiration,
    StatusExpirationSpeedElapsed,
    StatusExpirationActionsElapsed,
    StatusExpirationSaveSucceeded,
    StatusExpirationEnemyKilled,
    HealthTickResult,
    StatusExpirationRoundsElapsed,
    StatusPersistTypes,
    StatusSheet,
    TickOwnerData,
} from "./types"
export * from "./status"
/* export { calculateStatusMod } from "./status-mod"
export {
    decaySpeedElapsed,
    decayActionsElapsed,
    decaySaveSucceeded,
    decayEnemyKilled,
    expireStatusesAfterFight,
} from "./decay"
export { flatFootedStatus } from "./statuses/flat-footed" */

export const defaultStatusSheet: StatusSheet = {}
