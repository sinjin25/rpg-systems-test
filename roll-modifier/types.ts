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

// the group names every roll modifier produces today. Kept as the default so an
// unparameterized RollModifierResult behaves exactly as before, while a caller with
// its own vocabulary can pass one in and have queries check against that instead.
export type RollModifierGroup =
    | 'equipment mod'
    | 'base mod'
    | 'status mod'
    | 'feat mod'
    | 'base attack bonus'

export type RollModifierResult<G extends string = RollModifierGroup> = {
    total: number,
    groups: ModGroup<G>[],
}

export type RollModifierFunc<G extends string = RollModifierGroup> = () => RollModifierResult<G>

export type RollModifierFuncFactory<G extends string = RollModifierGroup> = (
    data: RollModifierRequiredData,
) => RollModifierFunc<G>

// G infers from the result passed in, so groupName checks against whatever
// vocabulary that result declares. NoInfer stops G also inferring from groupName -
// without it a typo would just widen G and be accepted.
export const util_findRollModifierGroupItem = <G extends string = RollModifierGroup>(
    rollModifierResult: RollModifierResult<G>,
    query: {
        groupName: NoInfer<G>, modDisplayName: string
    }
) => {
    if (!query.groupName || !query.modDisplayName) throw Error('did not pass either a query.groupName or query.modDisplayName')
    const group = rollModifierResult.groups.find(a => a.displayName === query.groupName)
    if (!group) return undefined
    const member = group.entries.find(a => a.displayName === query.modDisplayName)
    return member
}