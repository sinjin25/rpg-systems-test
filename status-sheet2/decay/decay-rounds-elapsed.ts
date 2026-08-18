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
        // copy: expireStatus mutates the array (and may delete the key) as we go
        for (const inst of [...owner.ss[key]!]) {
            if (!statusExpirationIsRoundsElapsed(inst.expiration)) continue

            inst.expiration.remaining -= elapsed
            if (inst.expiration.remaining <= 0) chainStatus(owner, expireStatus(owner, key, inst))
        }
    }
}
