import { standardFilters } from "../../feat/core-types"
import { calculateModifier } from "../../stat-modifier"
import { StatusEffect } from "../core-types"

// factory, not a static const like feat/feats/index.ts's exports, because
// `remaining` is computed per-actor from their own initiative roll
export const flatFootedStatus = (remaining: number): StatusEffect => ({
    displayName: 'Flat-Footed',
    description: 'This creature is not ready for combat and lacks an dex bonus to AC',
    expiration: { kind: 'speed-elapsed', remaining },
    context: {
        ac: {
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                whitelist: ['all'],
                blacklist: [],
            }),
            // cancels the dex bonus already added elsewhere in calculateAc's total
            mod: (data) => data?.cs ? -calculateModifier(data.cs.dex) : 0,
        },
    },
})

export default flatFootedStatus
