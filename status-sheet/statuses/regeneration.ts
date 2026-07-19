import { standardHealModifierFactory } from "../../heal"
import { StatusEffect } from "../core-types"

export const REGENERATION_ROUNDS = 5
export const REGENERATION_HEAL_PER_ROUND = 2

export const regenerationStatus = (roundsRemaining = REGENERATION_ROUNDS): StatusEffect => ({
    displayName: 'Regeneration',
    description: 'Heals a flat amount of HP each round',
    expiration: {
        kind: 'rounds-elapsed',
        remaining: roundsRemaining,
        // the heal broadContext affects this
        tick: ({ cs, fs, es, ss }) => ({
            kind: 'heal',
            amount: standardHealModifierFactory({
                cs, fs, es, ss,
                baseHeal: REGENERATION_HEAL_PER_ROUND,
            })().total,
        }),
    },
    context: {},
})

export default regenerationStatus
