import { createDefaultOwner as createLegacyOwner } from "../../defaults"
import { CharacterSheet } from "../../character-sheet"
import { EquipmentSheet } from "../../equipment-sheet"
import { StatusSheet } from "../../status-sheet"
import { AbilitySheet } from "../../ability-sheet"
import { FeatSheetMaximal, OwnerMaximal } from "./tree/types"

// Builds an OwnerMaximal for log2. Reuses the legacy default sheet-builder for the sheets we haven't
// migrated yet (cs/es/ss/as - including cs level cloning), then swaps in a NATIVE feat sheet. This is
// the one boundary where legacy sheet defaults meet the native owner, so tests no longer need per-call
// asFeat casts - a feat goes on the sheet as itself.
export const createDefaultOwner = (data: Partial<{
    cs: Partial<CharacterSheet>,
    fs: FeatSheetMaximal,
    es: Partial<EquipmentSheet>,
    ss: Partial<StatusSheet>,
    as: Partial<AbilitySheet>,
}> = {}): OwnerMaximal => {
    const { fs, ...rest } = data
    const base = createLegacyOwner(rest)
    return { ...base, fs: fs ?? {} }
}
