import { EquipmentSlot } from "../types";
import { BaseItemLookupValue, LookupTableValue, ModKind } from "./types";
import { ModLookupTable, slotBaseItemTables, slotLookupTables } from "./tables";

export type ModPosition = 'affix' | 'suffix'

export const getBaseItemTblBySlot = (
    slot: EquipmentSlot,
): Record<string, BaseItemLookupValue> => {
    return slotBaseItemTables[slot]
}

export const getModTblBySlot = (
    slot: EquipmentSlot,
    position: ModPosition,
    modName: ModKind,
): LookupTableValue[] => {
    return slotLookupTables[slot][position][modName] ?? []
}

export const getModsBySlot = (
    slot: EquipmentSlot,
    position: ModPosition,
): ModLookupTable => {
    return slotLookupTables[slot][position]
}

export const getModByRank = (
    slot: EquipmentSlot,
    position: ModPosition,
    modName: ModKind,
    rank: number,
): LookupTableValue | undefined => {
    const table = getModTblBySlot(slot, position, modName)

    let valueToReturn: undefined | LookupTableValue = undefined
    for (let i = 0; i < table.length; i++) {
        valueToReturn = table[i]
        if (rank === i) break
    }
    return valueToReturn
}

export type GetModValueByPerfectionOpts = {
    roundToTenths?: boolean,
}

export const getModValueByPerfection = (
    ltv: LookupTableValue,
    perfection: number, // 0-100
    opts: GetModValueByPerfectionOpts = {},
): number => {
    const raw = ltv.min + (ltv.max - ltv.min) * (perfection / 100)
    if (opts.roundToTenths) return Math.round(raw * 10) / 10
    return Math.round(raw)
}
