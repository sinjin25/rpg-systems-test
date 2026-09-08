import { OwnerMaximal } from '../actor2'
import type { AbilityCastType, AbilityCategory, AbilitySheet, AnyAbilitySheetDefinition } from './types'
export { AbilityCastType, AbilityCatalog, AbilityCategory, AbilitySheet, AbilityTags, AnyAbilitySheetDefinition } from './types'
export { resolveAbility } from './abilities2'
export { resolveAttackAbility } from './attack-ability'
export type { Participants } from './abilities2'
export type {
    Ability,
    AbilityPayload,
    AbilitySheetDefinition,
    DiscreteTargetGroup,
    DiscreteTargetGroupPayload,
    DiscreteTargetGroupPayloadResolution,
} from './abilities2/types'
export type {
    AttackAbility,
    AttackAbilitySheetDefinition,
    AttackDiscreteTargetGroup,
    AttackDiscreteTargetGroupPayload,
    AttackDiscreteTargetGroupPayloadResolution,
} from './attack-ability/types'


export const getAbilityKey = (ability: AnyAbilitySheetDefinition) => ability.displayName

export const addAbility = (
    owner: OwnerMaximal,
    ability: AnyAbilitySheetDefinition,
) => {
    const category = owner.as[ability.castType]

    const key = getAbilityKey(ability)
    const isNew = !category.items[key]
    category.items[key] = ability

    // if ability is new, add it to the end of the priority queue
    if (isNew) category.priority.push(key)
}

export const createAbilityCategory = (): AbilityCategory => ({
    items: {},
    priority: [],
    index: 0,
})

export const resetAbilityCategoryIndex = (owner: OwnerMaximal, category: AbilityCastType) => {
    const as = owner.as
    const catalog = as[category]
    if (!catalog) return
    catalog.index = 0
}

export const advanceAbilityCategoryIndex = (owner: OwnerMaximal, category: AbilityCastType) => {
    const as = owner.as
    const catalog = as[category]
    if (!catalog) return

    // we already ran out (in the past)
    if (catalog.index === -1) return

    catalog.index++
    // is there an item there?
    const index = catalog.index
    const key = catalog.priority[index]
    if (!key || !catalog.items[key]) catalog.index = -1
}

export const createDefaultAbilitySheet = (): AbilitySheet => ({
    standard: createAbilityCategory(),
    swift: createAbilityCategory(),
    free: createAbilityCategory(),
})
