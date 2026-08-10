import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecayOwner, StatusExpiration, StatusExpirationActionsElapsed } from "./types";

export const statusExpirationIsActionsElapsed = (
    expiration: StatusExpiration | undefined
): expiration is StatusExpirationActionsElapsed =>
    expiration?.kind === 'actions-elapsed'

export const decayActionsElapsed = (
    owner: DecayOwner,
    actionsTaken: number,
) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!statusExpirationIsActionsElapsed(status.expiration)) continue
        status.expiration.remaining -= actionsTaken
        if (status.expiration.remaining <= 0) chainStatus(owner, expireStatus(owner, key))
    }
}
