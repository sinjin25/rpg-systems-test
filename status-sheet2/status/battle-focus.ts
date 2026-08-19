import { leaf } from "../../log2"
import { makeWrapper } from "../instance"

export const BATTLE_FOCUS_CHARGE_ROUNDS = 3
export const BATTLE_FOCUS_ATTACK_BONUS = 4
export const BATTLE_FOCUS_DAMAGE_BONUS = 4

const displayName = 'Battle Focus (Active)'
export const battleFocusActiveStatus = () => makeWrapper({
    displayName,
    description: 'Combat prowess increased after charging up',
    broadContexts: {
        "attack-status-mod": () => leaf(displayName, BATTLE_FOCUS_ATTACK_BONUS),
        "crit-scalable-damage-status-mod": () => leaf(displayName, BATTLE_FOCUS_DAMAGE_BONUS)
    },
}, {
    expiration: { kind: 'actions-elapsed', remaining: 100 },
})

const displayName2 = 'Battle Focus'
export const battleFocusChargingStatus = (roundsUntilActive: number) => makeWrapper({
    displayName: displayName2,
    broadContexts: {},
    onExpiration: () => battleFocusActiveStatus(),
}, {
    expiration: { kind: 'rounds-elapsed', remaining: roundsUntilActive },
})

export default battleFocusChargingStatus
