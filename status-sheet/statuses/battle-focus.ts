import { allContexts } from "../../feat/core-types"
import { StatusEffect } from "../core-types"

export const BATTLE_FOCUS_CHARGE_ROUNDS = 3
export const BATTLE_FOCUS_ATTACK_BONUS = 4
export const BATTLE_FOCUS_DAMAGE_BONUS = 4

// the active buff, once battle focus has "kicked in" - lasts the rest of the
// fight, following the same actions-elapsed:100 convention as bless.ts
export const battleFocusActiveStatus = (): StatusEffect => ({
    displayName: 'Battle Focus (Active)',
    description: 'Combat prowess increased after charging up',
    expiration: { kind: 'actions-elapsed', remaining: 100 },
    context: {
        attack: { applies: allContexts, mod: () => BATTLE_FOCUS_ATTACK_BONUS },
        damage: { applies: allContexts, mod: () => BATTLE_FOCUS_DAMAGE_BONUS },
    },
})

// the "charging" status granted at fight start; grants no buff itself, and
// chains into battleFocusActiveStatus via onExpiration once its rounds run out
export const battleFocusChargingStatus = (roundsUntilActive: number): StatusEffect => ({
    displayName: 'Battle Focus (Charging)',
    description: 'Charging up - combat prowess will increase once this expires',
    expiration: { kind: 'rounds-elapsed', remaining: roundsUntilActive },
    context: {},
    onExpiration: () => battleFocusActiveStatus(),
})

export default battleFocusChargingStatus
