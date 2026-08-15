import { getStatusKey } from "../add-status-to-status-sheet";
import { StatusEffect } from "../types";
import { DecayChainStatusLog, DecayOwner } from "./types";

// onExpiration should return a log
export const chainStatus = (
    owner: DecayOwner,
    expired: StatusEffect | undefined,
): DecayChainStatusLog | undefined => {
    if (!expired) return
    const next = expired.onExpiration?.(owner)
    if (next) {
        owner.ss[getStatusKey(next)] = next
        return {
            key: getStatusKey(next),
            kind: 'replaced',
            source: expired,
        }
    }
}
