import { ContextNames, EquipmentContextNames } from "../contexts"
import { dagger } from "../defaults/equipment"
import { FeatContext, FeatModRequiredData } from "../feat/core-types"

export { createEquipment } from "./create-equipment.ts"
export type { CreateEquipmentInput } from "./create-equipment.ts"

export type { EquipmentContextNames }
export type EquipmentSlot = 'mainhand' | 'offhand' | 'twohanded' | 'armor' | 'ring' | 'amulet'

export type DamageRollFunc = (data?: Partial<FeatModRequiredData>) => number

// an independent mod source that carries its own display name for logging
export type NamedModContext = {
    displayName: string,
    context: FeatContext,
}

export type BaseEquipment = {
    displayName: string,
    description?: string,
    contexts: Array<ContextNames | EquipmentContextNames>,
    // each entry is an independent mod source with an applies function key and a mod function key
    // this has nothing to do with Feats specifically
    generateAdditionalContexts?: NamedModContext[],
}

export type Weapon = BaseEquipment & {
    damage: DamageRollFunc,
    // base threat range (e.g. 20, or 19 for a 19-20 threat range) and multiplier before feats/modifiers are added
    critRange?: number,
    critMultiplier?: number,
}

export type Armor = BaseEquipment & {
    ac?: number,
}

export type EquipmentSheet = {
    [K in EquipmentSlot]?: BaseEquipment | Weapon | Armor
}

export const defaultEquipmentSheet: EquipmentSheet = {
    mainhand: dagger,
}

export const equipmentIsWeapon = (d: BaseEquipment): d is Weapon => {
    if ('damage' in d) return true
    return false
}

export const equipmentIsArmor = (d: BaseEquipment): d is Armor => {
    if ('ac' in d) return true
    return false
}

export const equipmentIsBaseEquipment = (d: BaseEquipment): d is BaseEquipment => {
    if (!equipmentIsWeapon(d) && !equipmentIsArmor(d)) return true
    return false
}
