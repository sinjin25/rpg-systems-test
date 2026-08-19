import { OwnerMaximal } from "../../actor2"
import { leaf } from "../../log2"
import { featImprovedRage } from '../../feat2/feats/improved-rage'
import { makeWrapper } from "../instance"

export const RAGE_ROUNDS = 3
export const RAGE_ATTACK_BONUS = 2
export const RAGE_DAMAGE_BONUS = 2

const displayName = 'Rage'
export const rageStatus = makeWrapper({
    displayName,
    description: 'Increased combat prowess for a number of rounds',
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
}, {
    expiration: { kind: 'rounds-elapsed', remaining: RAGE_ROUNDS },
})

export default rageStatus
