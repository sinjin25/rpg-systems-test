import { CharacterSheet } from "../character-sheet"
import { EquipmentSheet, Weapon } from "../equipment-sheet"
import { FeatSheet } from "../feat"
import { StatusSheet } from "../status-sheet"
import { ModGroup } from "../stat-modifier/log"

export type RollModifierRequiredData = {
    cs: CharacterSheet,
    fs: FeatSheet,
    es: EquipmentSheet,
    ss: StatusSheet,
    weapon: Weapon,
}

export type RollModifierResult = {
    total: number,
    groups: ModGroup[],
}

export type RollModifierFunc = () => RollModifierResult

export type RollModifierFuncFactory = (
    data: RollModifierRequiredData,
) => RollModifierFunc

export const util_findRollModifierGroupItem = (
    rollModifierResult: RollModifierResult,
    query: {
        groupName: 'equipment mod' | 'base mod' | 'status mod' | 'feat mod', modDisplayName: string
    }
) => {
    if (!query.groupName || !query.modDisplayName) throw Error('did not pass either a query.groupName or query.modDisplayName')
    const group = rollModifierResult.groups.find(a => a.displayName === query.groupName)
    if (!group) return undefined
    const member = group.entries.find(a => a.displayName === query.modDisplayName)
    return member
}