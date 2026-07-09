import { BATTLE_FOCUS_CHARGE_ROUNDS, battleFocusChargingStatus } from "../../status-sheet/statuses/battle-focus"
import { Feat } from "../core-types"

export const featBattleFocus: Feat = {
    displayName: 'Battle Focus',
    description: 'Increases your stats after X rounds',
    context: {},
    onFightStart: () => battleFocusChargingStatus(BATTLE_FOCUS_CHARGE_ROUNDS),
}

export default featBattleFocus
