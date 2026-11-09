import type { ModNodeOpts } from '../../log2/types'
import type { BaseEquipment } from "../../equipment-sheet2/types"
import type { AbilitySheetDefinition } from '../../ability-sheet2/abilities2/types'
import type { AttackAbilitySheetDefinition } from '../../ability-sheet2/attack-ability/types'
import type { calculateAc, calculateAttack, calculateCritConfirm, calculateCritDamage, calculateDamage, calculateThreat } from './attack'

export type AttackOpts = ModNodeOpts & {
    relevantSlot: BaseEquipment,
}

export type StandardActionResult = {
    relevantSlot: BaseEquipment,
    attackResult: ReturnType<typeof calculateAttack>,
    damageResult: ReturnType<typeof calculateDamage>,
    threatResult: ReturnType<typeof calculateThreat>,
    critConfirmResult: ReturnType<typeof calculateCritConfirm>,
    critDamageResult: ReturnType<typeof calculateCritDamage>,
}

export type FinalStandardActionResult = Partial<StandardActionResult> & {
    acResult: ReturnType<typeof calculateAc>,
    relevantSlot: BaseEquipment,
}

export type Action = StandardActionResult | AbilitySheetDefinition | AttackAbilitySheetDefinition
