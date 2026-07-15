import { StatusEffect } from "../core-types"

export const REGENERATION_ROUNDS = 5
export const REGENERATION_HEAL_PER_ROUND = 2

export const regenerationStatus = (roundsRemaining = REGENERATION_ROUNDS): StatusEffect => ({
    displayName: 'Regeneration',
    description: 'Heals a flat amount of HP each round',
    expiration: {
        kind: 'rounds-elapsed',
        remaining: roundsRemaining,
        tick: () => REGENERATION_HEAL_PER_ROUND,
    },
    context: {},
})

export default regenerationStatus
