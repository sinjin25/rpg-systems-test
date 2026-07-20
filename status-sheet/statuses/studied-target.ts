import { standardFilters } from "../../feat/core-types"
import { StatusEffect } from "../core-types"

const AC_PENALTY = -1
// long enough to cover a normal fight. the swift re-applies every turn but the
// non-stacking guard drops it while this is still up
const DEFAULT_ROUNDS = 10

// the slayer has picked this creature apart and knows where it's open
export const studiedTargetStatus = (remaining = DEFAULT_ROUNDS): StatusEffect => ({
    displayName: 'Studied Target',
    description: 'This creature has been studied and is easier to hit',
    expiration: { kind: 'rounds-elapsed', remaining },
    context: {
        ac: {
            // 'all' because calculateAc feeds status mods the defender's own armor
            // tags - anything narrower would never fire
            applies: standardFilters.noBlacklistAnyWhitelistFactory({
                whitelist: ['all'],
                blacklist: [],
            }),
            mod: () => AC_PENALTY,
        },
    },
})

export default studiedTargetStatus
