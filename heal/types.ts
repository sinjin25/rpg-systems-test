import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { StatusSheet } from "../status-sheet"
import { ModGroup } from "../stat-modifier/log"

// heal mirrors the damage modifier pipeline, but has no weapon: a heal originates
// from a source's base amount (e.g. a regeneration status's per-round heal) rather
// than a rolled weapon, and stacks feat/equipment/status 'heal' modifiers on top.
export type HealModifierRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
    baseHeal: number,
}

export type HealModifierResult = {
    total: number,
    groups: ModGroup[],
}

export type HealModifierFunc = () => HealModifierResult

export type HealModifierFuncFactory = (
    data: HealModifierRequiredData,
) => HealModifierFunc
