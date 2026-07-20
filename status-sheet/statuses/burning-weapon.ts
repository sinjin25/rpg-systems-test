import { StatusEffect } from "../core-types"

export const BURNING_WEAPON_SAVE_DC = 15

// this is used for an MVP by itself and also as a save MVP for ignite.ts
// dc can be not passed in and it will act like a hazard (flat dc, unaffected by caster)
// alternatively, if you pass in a dc that will obviously replace the default DC, at which point it's affected by the caster's Owner properties (feats, equipment, cs, etc.)
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
