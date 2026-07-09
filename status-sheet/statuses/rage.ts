import { allContexts } from "../../feat/core-types"
import { StatusEffect } from "../core-types"

export const RAGE_ROUNDS = 3
export const RAGE_ATTACK_BONUS = 2
export const RAGE_DAMAGE_BONUS = 2

// might be more interesting as a str/con bonus as that affects savings
export const rageStatus = (roundsRemaining: number): StatusEffect => ({
    displayName: 'Rage',
    description: 'Increased combat prowess for a number of rounds',
    expiration: { kind: 'rounds-elapsed', remaining: roundsRemaining },
    context: {
        attack: { applies: allContexts, mod: () => RAGE_ATTACK_BONUS },
        damage: { applies: allContexts, mod: () => RAGE_DAMAGE_BONUS },
    },
})

export default rageStatus
