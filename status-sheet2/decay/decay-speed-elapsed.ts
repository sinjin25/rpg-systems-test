import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecayOwner, StatusExpiration, StatusExpirationSpeedElapsed } from "./types";

export const statusExpirationIsSpeedElapsed = (
    expiration: StatusExpiration | undefined
): expiration is StatusExpirationSpeedElapsed =>
    expiration?.kind === 'speed-elapsed'

export const decaySpeedElapsed = (owner: DecayOwner, elapsed: number) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!statusExpirationIsSpeedElapsed(status.expiration)) continue
        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) chainStatus(owner, expireStatus(owner, key))
    }
}
