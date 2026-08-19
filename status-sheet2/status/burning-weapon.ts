import { OwnerMaximal } from "../../actor2"
import { leaf } from "../../log2"
import featContribution from "../../log2/composition/feat-contribution"
import roll from "../../roll"
import { makeWrapper } from "../instance"

export const BURNING_WEAPON_SAVE_DC = 15

const displayName = 'Burning (Burning Weapon)'
const dc = leaf(displayName, BURNING_WEAPON_SAVE_DC)

export const burningWeaponStatus = makeWrapper({
    displayName,
    description: 'Reflex save each round to put out the flames',
    broadContexts: {},
    tick: {
        calculateDamage: {
            base: () => leaf('burning weapon 1d4', roll(4)),
            mod: (source: OwnerMaximal) => featContribution('damage-over-time-feat-mod')(source),
        },
    },
}, {
    expiration: { kind: 'save-succeeded', saveType: 'reflex', dc },
})

export default burningWeaponStatus
