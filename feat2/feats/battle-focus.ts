import { leaf } from "../../log2";
import { Feat2 } from "..";
import { BATTLE_FOCUS_CHARGE_ROUNDS, battleFocusChargingStatus } from "../../status-sheet2";

const displayName = 'Battle Focus'
export default {
    displayName,
    description: 'Increases your stats after X rounds',
    broadContexts: {},
    onFightStart: () => battleFocusChargingStatus(BATTLE_FOCUS_CHARGE_ROUNDS),
} as const satisfies Feat2