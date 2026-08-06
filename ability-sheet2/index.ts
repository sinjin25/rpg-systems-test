import { createDefaultOwner, OwnerMaximal } from '../actor2'
import type { ModNode } from '../log2'
import { StatusEffect } from '../status-sheet2'
import type { Ability, AbilityCategory, AbilityModNode, AbilitySheet, SnapshotAbility, } from './types'
export { Ability, AbilityCastType, AbilityCatalog, AbilityCategory, AbilityModNode, AbilitySheet, AbilityTags, Handlers } from './types'


export const getAbilityKey = (ability: Ability | SnapshotAbility) => {
    if (typeof ability === 'function') return ability(createDefaultOwner()).displayName
    return ability.displayName
}

export const addAbility = (
    owner: OwnerMaximal,
    ability: Ability | SnapshotAbility,
) => {
    const ab = typeof ability === 'function' ? ability(owner) : ability
    const category = owner.as[ab.castType]

    const key = getAbilityKey(ab)
    const isNew = !category.items[key]
    category.items[key] = ab

    // if ability is new, add it to the end of the priority queue
    if (isNew) category.priority.push(key)
}

export const createAbilityCategory = (): AbilityCategory => ({
    items: {},
    priority: [],
    index: 0,
})

export const createDefaultAbilitySheet = (): AbilitySheet => ({
    standard: createAbilityCategory(),
    swift: createAbilityCategory(),
    free: createAbilityCategory(),
})

export const abilityModNodePayloadIsModNode = (
    a: AbilityModNode['payload']
): a is ModNode => {
    return 'total' in a
}

export const abilityModNodePayloadIsStatusEffect = (
    a: AbilityModNode['payload']
): a is StatusEffect => {
    return 'total' in a === false
}