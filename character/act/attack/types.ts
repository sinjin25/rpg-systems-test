import { CharacterSheet } from "../../../character-sheet"
import { EquipmentSheet, Weapon } from "../../../equipment-sheet"
import { FeatSheet } from "../../../feat"
import { ModLog, ModResult } from "../../../stat-modifier/log"
import { StatusSheet } from "../../../status-sheet"

export type AttackRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
}

export type StandardActionResult = {
    attackRoll: number,
    damageRoll: number,
    attackLog: ModLog,
    damageLog: ModLog,
    weapon: Weapon,

    confirmRoll: number,
    confirmLog: ModLog,

    critRange: number,
    critMultiplier: number,
    critRangeLog: ModLog,
    critMultiplierLog: ModLog,

    critScaledDamage: ModResult,
    critFlatDamage: ModResult,
}
