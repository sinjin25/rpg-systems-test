import { StatusEffect } from "../core-types"
import roll from "../../roll"

export const BURNING_WEAPON_ROUNDS = 3
export const BURNING_WEAPON_DIE_SIDES = 6

export const burningWeaponStatus = (roundsRemaining = BURNING_WEAPON_ROUNDS): StatusEffect => ({
    displayName: 'Burning (Burning Weapon)',
    description: 'Takes fire damage each round',
    expiration: {
        kind: 'rounds-elapsed',
        remaining: roundsRemaining,
        tick: () => -roll(BURNING_WEAPON_DIE_SIDES),
    },
    context: {},
})

export default burningWeaponStatus
