import roll from "../../roll"
import { divineProtectionStatus } from "../../status-sheet/statuses/divine-protection"
import { Feat } from "../core-types"

// a feat which creates a status effect onFightStart
export const featDivineProtection: Feat = {
    displayName: 'Divine Protection',
    description: 'Gain 1d4 temporary AC for 1d4 rounds',
    context: {},
    onFightStart: () => divineProtectionStatus({
        acBonus: roll(4),
        roundsRemaining: roll(4),
    }),
}

export default featDivineProtection
