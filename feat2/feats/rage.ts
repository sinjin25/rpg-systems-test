import { Feat2 } from "..";
import rageStatus, { RAGE_ROUNDS } from "../../status-sheet/statuses/rage";

const displayName = 'Rage'
export default {
    displayName,
    description: 'Increase your stats for X rounds',
    broadContexts: {},
    onFightStart: () => rageStatus(RAGE_ROUNDS)
} as Feat2