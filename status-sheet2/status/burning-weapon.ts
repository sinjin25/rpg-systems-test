import { StatusEffect } from ".."


export const BURNING_WEAPON_SAVE_DC = 15

export const burningWeaponStatus = (dc = BURNING_WEAPON_SAVE_DC): StatusEffect => ({
    displayName: 'Burning (Burning Weapon)',
    broadContexts: {},
    description: 'Reflex save each round to put out the flames',
    expiration: {
        kind: 'save-succeeded',
        saveType: 'reflex',
        dc,
    },
})

export default burningWeaponStatus
