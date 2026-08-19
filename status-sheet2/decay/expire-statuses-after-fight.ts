import { chainStatus } from "./chain-status";
import { expireStatus } from "./expire-status";
import { DecayOwner } from "./types";

export const expireStatusesAfterFight = (
    owner: DecayOwner
) => {
    const keys = Object.keys(owner.ss)
    for (let key of keys) {
        for (const inst of [...owner.ss[key]!]) {
            if (!inst.pointer.persists?.afterBattle) continue
            chainStatus(owner, expireStatus(owner, key, inst))
        }
    }
}
