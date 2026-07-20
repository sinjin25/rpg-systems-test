import { Ability } from "../../../ability-sheet"
import { CharacterSheet } from "../../../character-sheet"
import { EquipmentSheet } from "../../../equipment-sheet"
import { FeatSheet } from "../../../feat"
import { SaveType } from "../../../save"
import { ModLog } from "../../../stat-modifier/log"
import { StatusSheet } from "../../../status-sheet"

// the Ability data model itself lives in ability-sheet; these are the act-time
// types: what useAbility needs and what it produces

export type AbilityModifierRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
    ability: Ability,
}

export type AbilityActionResult = {
    ability: Ability,
    save?: {
        type: SaveType,
        dc: number, // convenience getter
        dcLog: ModLog,
    },
    damage?: {
        damageLog: ModLog,
        passedSaveDamageLog?: ModLog,
        // convenience, derived
        damageRoll: number,
        passedSaveDamageRoll?: number,
    },
}
