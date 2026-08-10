import { Actor2, OwnerMaximal } from "../../actor2";
import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { StatusExpiration, StatusExpirationRoundsElapsed } from "./types";

export const statusExpirationIsRoundsElapsed = (
    expiration: StatusExpiration | undefined
): expiration is StatusExpirationRoundsElapsed =>
    expiration?.kind === 'rounds-elapsed'

export const decayRoundsElapsed = (owner: OwnerMaximal, elapsed: number, self?: Actor2) => {
    for (const key of Object.keys(owner.ss)) {
        const status = owner.ss[key]
        if (!statusExpirationIsRoundsElapsed(status.expiration)) continue

        status.expiration.remaining -= elapsed
        if (status.expiration.remaining <= 0) chainStatus(owner, expireStatus(owner, key))
    }
}
