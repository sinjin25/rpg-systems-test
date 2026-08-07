import { SnapshotStatusEffect, StatusEffect } from ".."
import { OwnerMaximal } from "../../actor2"
import { leaf } from "../../log2"
import { featImprovedRage } from '../../feat2/feats/improved-rage'

export const RAGE_ROUNDS = 3
export const RAGE_ATTACK_BONUS = 2
export const RAGE_DAMAGE_BONUS = 2

// might be more interesting as a str/con bonus as that affects savings
const displayName = 'Rage'
export const rageStatus: SnapshotStatusEffect = (data: {
    snapshot: OwnerMaximal,
}) => {
    return {
        displayName,
        description: 'Increased combat prowess for a number of rounds',
        expiration: { kind: 'rounds-elapsed', remaining: RAGE_ROUNDS },
        broadContexts: {
            "attack-status-mod": (o: OwnerMaximal) => {
                const hasImprovedRage = !!o.fs[featImprovedRage.displayName]
                let bonus = RAGE_ATTACK_BONUS
                if (hasImprovedRage) bonus += 2
                return leaf(displayName, bonus)
            },
            "crit-scalable-damage-status-mod": (o: OwnerMaximal) => {
                const hasImprovedRage = !!o.fs[featImprovedRage.displayName]
                let bonus = RAGE_DAMAGE_BONUS
                if (hasImprovedRage) bonus += 2
                return leaf(displayName, bonus)
            }
        }
    } as StatusEffect
}

export default rageStatus
