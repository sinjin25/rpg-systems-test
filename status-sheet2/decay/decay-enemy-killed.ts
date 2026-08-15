import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecayOwner, StatusExpiration, StatusExpirationEnemyKilled } from "./types";

export const statusExpirationIsEnemyKilled = (
    expiration: StatusExpiration | undefined
): expiration is StatusExpirationEnemyKilled =>
    expiration?.kind === 'enemy-killed'

export const decayEnemyKilled = (
    owners: DecayOwner[],
    killed: { health: { curr: number } },
) => {
    for (const owner of owners) {
        for (const key of Object.keys(owner.ss)) {
            const status = owner.ss[key]
            if (!statusExpirationIsEnemyKilled(status.expiration)) continue
            if (status.expiration.enemy === killed) chainStatus(owner, expireStatus(owner, key))
        }
    }
}
