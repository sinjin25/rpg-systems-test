import { StatusEffect, StatusEffectInstance } from "../../status-sheet2"
import { FrozenExpiration, FrozenStatus } from "../types"
import freezeModNodeRecursive from "./mod-node"

// we've left a lot of keys out which causes problems when you try to plug a snapshotted actor into anything wanting an Actor2
// If we wanna do something about it we need the shapes to match better
// freezeStatus is used by actor snapshots (as opposed to definition which is used by abilities)

const freezeStatus = (inst: StatusEffectInstance): FrozenStatus => {
    const { displayName, description } = inst.pointer
    const { expiration } = inst

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

// freeze a definition (not yet applied, so no instance expiration to capture)
// this is used by an ability snapshot
export const freezeStatusDefinition = (def: StatusEffect): FrozenStatus => ({
    displayName: def.displayName,
    description: def.description,
})

export default freezeStatus