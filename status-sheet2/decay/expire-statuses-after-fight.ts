import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecayOwner } from "./types";

export const expireStatusesAfterFight = (
    owner: DecayOwner
) => {
    const keys = Object.keys(owner.ss)
    for (let key of keys) {
        const v = owner.ss[key]
        if (!v.persists) continue
        if (!v.persists.afterBattle) continue
        chainStatus(owner, expireStatus(owner, key))
    }
}
