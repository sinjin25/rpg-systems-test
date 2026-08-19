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
        for (const inst of [...owner.ss[key]!]) {
            if (!statusExpirationIsActionsElapsed(inst.expiration)) continue
            inst.expiration.remaining -= actionsTaken
            if (inst.expiration.remaining <= 0) chainStatus(owner, expireStatus(owner, key, inst))
        }
    }
}
