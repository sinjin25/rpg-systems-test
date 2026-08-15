import { StatusEffect } from "../../status-sheet2"
import { FrozenExpiration, FrozenStatus } from "../types"
import freezeModNodeRecursive from "./mod-node"

// we've left a lot of keys out which causes problems when you try to plug a snapshotted actor into anything wanting an Actor2
// If we wanna do something about it we need the shapes to match better

const freezeStatus = (st: StatusEffect): FrozenStatus => {
    const { broadContexts, displayName, description, expiration, onExpiration, persists, tick } = st

    if (!expiration) {
        return {
            displayName,
            description
        }
    }

    const exp: FrozenExpiration = {
        kind: expiration.kind,
    }

    const { kind } = expiration
    switch (kind) {
        case 'enemy-killed':
            const { enemy } = expiration
            throw Error('we did not write handling enemy-killed for time travel')
            break;
        case 'save-succeeded':
            const { dc, saveType } = expiration
            exp.dc = freezeModNodeRecursive(dc)
            exp.saveType = saveType
            break;
        case 'actions-elapsed':
        case 'rounds-elapsed':
        case 'speed-elapsed':
            const { remaining } = expiration
            exp.remaining = remaining
    }
    return {
        // ignore broadContexts
        expiration: exp,
        displayName,
        description,
    }
}

export default freezeStatus