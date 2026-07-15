import { StatusEffect } from "../core-types"

export const BURNING_WEAPON_SAVE_DC = 15

// MVP wiring for the save-succeeded decay path: rather than lasting a fixed
// number of rounds, the burning target attempts a reflex save each round (see
// decaySaveSucceeded in ../decay.ts) and shakes off the flames on a success.
export const burningWeaponStatus = (dc = BURNING_WEAPON_SAVE_DC): StatusEffect => ({
    displayName: 'Burning (Burning Weapon)',
    description: 'Reflex save each round to put out the flames',
    expiration: {
        kind: 'save-succeeded',
        saveType: 'reflex',
        dc,
    },
    context: {},
})

export default burningWeaponStatus
