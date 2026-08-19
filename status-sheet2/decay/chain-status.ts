import { getStatusKey } from "../add-status-to-status-sheet";
import { StatusEffectInstance } from "../types";
import { DecayChainStatusLog, DecayOwner } from "./types";

// onExpiration should return a log
export const chainStatus = (
    owner: DecayOwner,
    expired: StatusEffectInstance | undefined,
): DecayChainStatusLog | undefined => {
    if (!expired) return
    const next = expired.pointer.onExpiration?.(owner)
    if (!next) return

    // the chained status inherits the expired instance's source
    const key = getStatusKey(next)
    if (owner.ss[key] === undefined) owner.ss[key] = []
    owner.ss[key].push(next.factory(expired.source))

    return {
        key,
        kind: 'replaced',
        source: expired.pointer,
    }
}
