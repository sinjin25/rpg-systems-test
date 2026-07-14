import { allContexts } from "../../feat/core-types"
import { StatusEffect } from "../core-types"

export const FATIGUING_BLOWS_ATTACK_PENALTY = -1
export const FATIGUING_BLOWS_ROUNDS = 3

// applied to an enemy that was just missed - a flat attack debuff, non-stacking
// (see trigger/apply.ts's applyStatusTriggerEffect)
export const fatiguingBlowsStatus = (): StatusEffect => ({
    displayName: 'Fatiguing Blows',
    description: 'A flat attack penalty from having to dodge relentless blows',
    expiration: { kind: 'rounds-elapsed', remaining: FATIGUING_BLOWS_ROUNDS },
    context: {
        attack: { applies: allContexts, mod: () => FATIGUING_BLOWS_ATTACK_PENALTY },
    },
})

export default fatiguingBlowsStatus
