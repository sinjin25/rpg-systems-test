import { EquipmentSlot } from "../../types";
import { BaseItemLookupValue, LookupTableValue } from "../types";
import type { ModPosition } from "../util";

export * from './weapon'
export * from './twohand'
export * from './armor'
export * from './offhand'
export * from './ring'
export * from './amulet'

import {
    weaponAffixLookupTable, weaponBaseItemLookupTable, weaponSuffixLookupTable,
} from './weapon'
import {
    twohandAffixLookupTable, twohandBaseItemLookupTable, twohandSuffixLookupTable,
} from './twohand'
import {
    armorAffixLookupTable, armorBaseItemLookupTable, armorSuffixLookupTable,
} from './armor'
import {
    offhandAffixLookupTable, offhandBaseItemLookupTable, offhandSuffixLookupTable,
} from './offhand'
import {
    ringAffixLookupTable, ringBaseItemLookupTable, ringSuffixLookupTable,
} from './ring'
import {
    amuletAffixLookupTable, amuletBaseItemLookupTable, amuletSuffixLookupTable,
} from './amulet'

export type ModLookupTable = Record<string, LookupTableValue[]>

export const slotLookupTables: Record<EquipmentSlot, Record<ModPosition, ModLookupTable>> = {
    mainhand: { affix: weaponAffixLookupTable, suffix: weaponSuffixLookupTable },
    offhand: { affix: offhandAffixLookupTable, suffix: offhandSuffixLookupTable },
    twohanded: { affix: twohandAffixLookupTable, suffix: twohandSuffixLookupTable },
    armor: { affix: armorAffixLookupTable, suffix: armorSuffixLookupTable },
    ring: { affix: ringAffixLookupTable, suffix: ringSuffixLookupTable },
    amulet: { affix: amuletAffixLookupTable, suffix: amuletSuffixLookupTable },
}

export const slotBaseItemTables: Record<EquipmentSlot, Record<string, BaseItemLookupValue>> = {
    mainhand: weaponBaseItemLookupTable,
    offhand: offhandBaseItemLookupTable,
    twohanded: twohandBaseItemLookupTable,
    armor: armorBaseItemLookupTable,
    ring: ringBaseItemLookupTable,
    amulet: amuletBaseItemLookupTable,
}
