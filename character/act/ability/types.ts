import { CharacterSheet } from "../../../character-sheet"
import { ContextNames } from "../../../contexts"
import { EquipmentSheet } from "../../../equipment-sheet"
import { FeatSheet } from "../../../feat"
import { FeatModFunction } from "../../../feat/core-types"
import { SaveType } from "../../../save"
import { ModLog } from "../../../stat-modifier/log"
import { StatusEffect } from "../../../status-sheet/core-types"
import { StatusSheet } from "../../../status-sheet"

export type AbilityKeyStat = 'str' | 'dex' | 'con'

export type AbilitySaveDamageOutcome = 'full' | 'half' | 'none'

export type AbilitySave = {
    // which save the target rolls against the DC
    type: SaveType,
    // per-ability base
    baseDc: number,
    // what to do on a save pass to damage
    damageOnPass: AbilitySaveDamageOutcome,
}

export type Ability = {
    displayName: string,
    keyStat: AbilityKeyStat,
    contexts: ContextNames[],
    damage?: FeatModFunction,
    // a save is optional
    save?: AbilitySave,
    onFailedSave?: (dc: number) => StatusEffect,
}

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
