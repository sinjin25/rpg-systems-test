import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecayOwner, StatusExpiration, StatusExpirationActionsElapsed } from "./types";

export const statusExpirationIsActionsElapsed = (
    expiration: StatusExpiration | undefined
): expiration is StatusExpirationActionsElapsed =>
    expiration?.kind === 'actions-elapsed'

// returns how many statuses expired, so callers can react (ex: recalc health)
export const decayActionsElapsed = (
    owner: DecayOwner,
    actionsTaken: number,
): number => {
    let expired = 0
    for (const key of Object.keys(owner.ss)) {
        for (const inst of [...owner.ss[key]!]) {
            if (!statusExpirationIsActionsElapsed(inst.expiration)) continue
            inst.expiration.remaining -= actionsTaken
            if (inst.expiration.remaining <= 0) {
                const removed = expireStatus(owner, key, inst)
                chainStatus(owner, removed)
                if (removed) expired++
            }
        }
    }
    return expired
}
