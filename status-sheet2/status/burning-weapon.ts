import { StatusEffect, TickOwnerData } from ".."
import { Actor2, OwnerMaximal } from "../../actor2"
import { leaf } from "../../log2"
import damageOverTimeTaken from "../../log2/terminal-composition/damage-over-time-taken"
import damageTaken from "../../log2/terminal-composition/damage-taken"
import damageOverTime from "../../log2/terminal/damage-over-time"
import roll from "../../roll"
import { SnapshotStatusEffect } from "../types"


export const BURNING_WEAPON_SAVE_DC = 15

export const burningWeaponStatus: SnapshotStatusEffect = (data: {
    snapshot: OwnerMaximal,
}): StatusEffect => {
    const dc = 15 // figure out the dc with a tree=
    return {
        displayName: 'Burning (Burning Weapon)',
        broadContexts: {},
        description: 'Reflex save each round to put out the flames',
        expiration: {
            kind: 'save-succeeded',
            saveType: 'reflex',
            dc,
        },
        tick: {
            calculateDamage: (receiver: OwnerMaximal) => {
                const base = leaf('burning weapon 1d4', roll(4))
                const node = damageOverTime(base)(data.snapshot)
                return damageOverTimeTaken({
                    node,
                })(receiver)
            }
        }
    }
}

export default burningWeaponStatus
