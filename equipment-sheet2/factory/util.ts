import { EquipmentSlot } from "../types";
import { BaseItemLookupValue, LookupTableValue, ModKind } from "./types";
import { weaponAffixLookupTable, weaponBaseItemLookupTable, weaponSuffixLookupTable } from "./tables/weapon";
import { twohandAffixLookupTable, twohandBaseItemLookupTable, twohandSuffixLookupTable } from "./tables/twohand";
import { armorAffixLookupTable, armorSuffixLookupTable } from "./tables/armor";
import { ringAffixLookupTable, ringSuffixLookupTable } from "./tables/ring";
import { amuletAffixLookupTable, amuletSuffixLookupTable } from "./tables/amulet";

type ModLookupTable = Record<string, LookupTableValue[]>
export type ModPosition = 'affix' | 'suffix'

const slotLookupTables: Record<EquipmentSlot, Record<ModPosition, ModLookupTable>> = {
    mainhand: { affix: weaponAffixLookupTable, suffix: weaponSuffixLookupTable },
    offhand: { affix: {}, suffix: {} },
    twohanded: { affix: twohandAffixLookupTable, suffix: twohandSuffixLookupTable },
    armor: { affix: armorAffixLookupTable, suffix: armorSuffixLookupTable },
    ring: { affix: ringAffixLookupTable, suffix: ringSuffixLookupTable },
    amulet: { affix: amuletAffixLookupTable, suffix: amuletSuffixLookupTable },
}

const slotBaseItemTables: Record<EquipmentSlot, Record<string, BaseItemLookupValue>> = {
    mainhand: weaponBaseItemLookupTable,
    offhand: {},
    twohanded: twohandBaseItemLookupTable,
    armor: {},
    ring: {},
    amulet: {},
}

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

export const getModValueByPerfection = (
    ltv: LookupTableValue,
    perfection: number, // 0-100
): number => {
    return Math.round(ltv.min + (ltv.max - ltv.min) * (perfection / 100))
}
