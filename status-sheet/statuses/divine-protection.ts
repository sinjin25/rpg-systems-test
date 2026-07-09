import { allContexts } from "../../feat/core-types"
import { StatusEffect } from "../core-types"

// factory, not a static const, because acBonus/roundsRemaining are rolled
// once at grant time (1d4/1d4) rather than re-rolled on every mod() call
export const divineProtectionStatus = (opts: {
    acBonus: number, roundsRemaining: number
}): StatusEffect => ({
    displayName: 'Divine Protection',
    description: 'Temporary AC gained at the start of the fight',
    expiration: { kind: 'rounds-elapsed', remaining: opts.roundsRemaining },
    context: {
        ac: {
            applies: allContexts,
            mod: () => opts.acBonus,
        },
    },
})

export default divineProtectionStatus
