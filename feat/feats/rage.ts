import { RAGE_ROUNDS, rageStatus } from "../../status-sheet/statuses/rage"
import { Feat } from "../core-types"

export const featRage: Feat = {
    displayName: 'Rage',
    description: 'Increase your stats for X rounds',
    context: {},
    onFightStart: () => rageStatus(RAGE_ROUNDS),
}

export default featRage
