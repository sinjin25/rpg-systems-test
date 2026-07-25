import { leaf } from "../../log2";
import { Feat2 } from "..";
import divineProtectionStatus from "../../status-sheet/statuses/divine-protection";
import roll from "../../roll";

const displayName = 'Divine Protection'
export default {
    displayName,
    broadContexts: {},
    description: 'Gain 1d4 temporary AC for 1d4 rounds',
    onFightStart: () => divineProtectionStatus({
        acBonus: roll(4),
        roundsRemaining: roll(4),
    }),
} as Feat2