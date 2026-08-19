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
            for (const inst of [...owner.ss[key]!]) {
                if (!statusExpirationIsEnemyKilled(inst.expiration)) continue
                if (inst.expiration.enemy === killed) chainStatus(owner, expireStatus(owner, key, inst))
            }
        }
    }
}
