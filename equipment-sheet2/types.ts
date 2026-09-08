import { Tags } from "../log2/tags";
import { ObjectWithBroadContexts } from "../log2/types";

export type EquipmentSlot = 'mainhand' | 'offhand' | 'twohanded' | 'armor' | 'ring' | 'amulet'
export type BaseEquipment = {
    acceptableSlots: EquipmentSlot[]
    tags?: Tags[], // ex: ['finesse', 'melee']
} & ObjectWithBroadContexts
export type EquipmentSheet = {
    [K in EquipmentSlot]?: BaseEquipment
}