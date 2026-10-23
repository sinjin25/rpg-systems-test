import { EquipmentSlot } from "../types";
import { LookupTableValue, ModKind } from "./types";
import { weaponAffixLookupTable, weaponSuffixLookupTable } from "./tables/weapon";
import { twohandAffixLookupTable, twohandSuffixLookupTable } from "./tables/twohand";
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
