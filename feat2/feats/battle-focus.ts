import { leaf } from "../../log2";
import { Feat2 } from "..";
import battleFocusChargingStatus, { BATTLE_FOCUS_CHARGE_ROUNDS } from "../../status-sheet/statuses/battle-focus";

const displayName = 'Battle Focus'
export default {
    displayName,
    description: 'Increases your stats after X rounds',
    broadContexts: {},
    onFightStart: () => battleFocusChargingStatus(BATTLE_FOCUS_CHARGE_ROUNDS),
} as Feat2