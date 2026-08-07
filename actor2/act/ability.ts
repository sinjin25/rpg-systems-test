import { Actor2, OwnerMaximal } from ".."
import { Ability, AbilityCastType, AbilityModNode, abilityModNodePayloadIsStatusEffect } from "../../ability-sheet2"
import { applyDamage } from "../../health"
import { findNodeMatching, ModNode } from "../../log2"
import { save } from "../../log2/terminal"
import dc from "../../log2/terminal/dc"
import { addStatusToStatusSheet, StatusEffect } from "../../status-sheet2"

const calculateDc = (owner: OwnerMaximal, opts: {
    ability: Ability
}): ModNode => {
    const { ability } = opts
    const node = dc({
        baseDc: ability.dc!.baseDc,
        tags: ability.dc!.tags,
    })(owner)

    return node
}

const calculateSave = (owner: OwnerMaximal, opts: {
    saveType: 'reflex' | 'fortitude'
}): ModNode => {
    return save(opts.saveType)(owner)
}

// a handler still needs to exist to figure out what to do with these AbilityModNodes
export const generateAbilityModNodes = (owner: OwnerMaximal, ability: Ability): AbilityModNode[] => {
    /* console.log('received', ability) */
    if (!ability.handlers) return []

    const amn: AbilityModNode[] = []
    const { onFailedSave, onSave, onUse } = ability.handlers

    if (!ability.dc) {
        if (onUse) amn.push(...onUse())
    } else {
        if (onUse) amn.push(...onUse())
        const dc = calculateDc(owner, {
            ability
        })
        const save = calculateSave(owner, {
            saveType: ability.dc.saveType
        })
        const didSave = save.total() >= dc.total()
        if (!didSave && onFailedSave) amn.push(...onFailedSave())
        if (didSave && onSave) amn.push(...onSave())
    }

    return amn
}

const handleAmnModNode = (
    receiver: Actor2,
    node: ModNode, // currently only damage exists
) => {
    applyDamage(receiver.health, node.total())
}

const handleAmnStatusEffect = (receiver: Actor2, st: StatusEffect) => {
    addStatusToStatusSheet(receiver.owner, st)
}

export const handleAbilityModNodes = (caster: Actor2, receiver: Actor2, amnArr: AbilityModNode[]) => {
    for (const amn of amnArr) {
        const { payload, target } = amn
        if (abilityModNodePayloadIsStatusEffect(payload)) {
            switch (target) {
                case 'ally':
                    throw Error('not implemented')
                    break
                case 'self':
                    handleAmnStatusEffect(caster, payload)
                    break
                case 'target':
                    handleAmnStatusEffect(receiver, payload)
                    break
            }
        } else {
            switch (target) {
                case 'ally':
                    throw Error('not implemented')
                    break
                case 'self':
                    handleAmnModNode(caster, payload)
                    break
                case 'target':
                    handleAmnModNode(receiver, payload)
                    break
            }
        }
    }
}

// this selects and then does generateAbilityModNodes
export const selectAndPrepAbility = (
    caster: Actor2,
    category: AbilityCastType
): undefined | AbilityModNode[] => {
    const { as } = caster.owner

    // do we even have items to pick?
    const catalog = as[category]
    const OUT_OF_ITEMS_INDEX = -1
    const HAS_ITEMS = catalog.priority.length > 0
    if (!HAS_ITEMS || catalog.index === OUT_OF_ITEMS_INDEX) return undefined

    const key = catalog.priority[catalog.index]
    if (!key) return undefined

    const item = catalog.items[key]
    if (!item) return undefined

    // we have out item, calculate
    const gamn = generateAbilityModNodes(caster.owner, item)
    return gamn
}