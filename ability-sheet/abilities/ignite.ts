import roll from "../../roll"
import burningWeaponStatus from "../../status-sheet/statuses/burning-weapon"
import { Ability } from "../types"

const DC = 15
// MVP concrete ability: sets the target alight. 1d6 fire damage whether the
// reflex save passes or fails (damageOnPass 'full'); a failed save also
// applies the burning status, itself shaken off via a reflex save each round
// (decaySaveSucceeded) against this same DC
export const ignite: Ability = {
    displayName: 'Ignite',
    keyStat: 'con',
    castType: 'standard',
    contexts: ['magic'],
    damage: () => roll(6),
    save: {
        type: 'reflex',
        // matches the burn's shake-off save so the initial and recurring saves agree
        baseDc: DC,
        damageOnPass: 'full',
    },
    onFailedSave: (dc) => burningWeaponStatus(dc),
}

export default ignite
